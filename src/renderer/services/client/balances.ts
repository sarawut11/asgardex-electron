import * as RD from '@devexperts/remote-data-ts'
import { baseAmount, Chain } from '@thorchain/asgardex-util'
import * as F from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Rx from 'rxjs'
import { Observable } from 'rxjs'
import { catchError, debounceTime, map, shareReplay, startWith, switchMap } from 'rxjs/operators'

import { triggerStream } from '../../helpers/stateHelper'
import { getWalletBalances } from '../binance/utils'
import { ApiError, AssetsWithBalanceRD, AssetWithBalance, ErrorId } from '../wallet/types'
import { Client, assetByChain } from './helpers'

export const createBalancesService = <T extends Chain, C extends Client>(
  chain: T,
  client$: Observable<O.Option<C>>,
  decimal: number
) => {
  /**
   * Observable to load balances from Client's API endpoint
   * If client is not available, it returns an `initial` state
   */
  const loadBalances$ = (client: C): Observable<AssetsWithBalanceRD> =>
    Rx.from(client.getBalance()).pipe(
      map((balances) => {
        console.log('balances', balances)
        // Only for BNB chain
        if (Array.isArray(balances)) {
          return RD.success(getWalletBalances(balances))
        }

        return RD.success([
          {
            asset: assetByChain(chain),
            amount: baseAmount(balances.toString(), decimal),
            frozenAmount: O.none
          } as AssetWithBalance
        ])
      }),
      catchError((error: Error) =>
        Rx.of(RD.failure({ chainId: chain, errorId: ErrorId.GET_BALANCES, msg: error?.message ?? '' } as ApiError))
      ),
      startWith(RD.pending)
    )

  // `TriggerStream` to reload `Balances`
  const { stream$: reloadBalances$, trigger: reloadBalances } = triggerStream()

  /**
   * State of `Balance`s provided as `AssetsWithBalanceRD`
   *
   * Data will be loaded by first subscription only
   * If a client is not available (e.g. by removing keystore), it returns an `initial` state
   */
  const assetsWB$: Observable<AssetsWithBalanceRD> = Rx.combineLatest([
    reloadBalances$.pipe(debounceTime(300)),
    client$
  ]).pipe(
    switchMap(([_, client]) => {
      return F.pipe(
        client,
        O.fold(
          // if a client is not available, "reset" state to "initial"
          () => Rx.of(RD.initial),
          // or start request and return state
          loadBalances$
        )
      )
    }),
    // cache it to avoid reloading data by every subscription
    shareReplay(1)
  )

  return {
    reloadBalances,
    assetsWB$
  }
}
