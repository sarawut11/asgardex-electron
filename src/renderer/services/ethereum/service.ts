import { Client as EthereumClient, Address } from '@thorchain/asgardex-ethereum'
import { ETHChain } from '@thorchain/asgardex-util'
import * as F from 'fp-ts/function'
import { right, left } from 'fp-ts/lib/Either'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Observable } from 'rxjs'

import { ETH_DECIMAL } from '../../helpers/assetHelper'
import { liveData } from '../../helpers/rx/liveData'
import { createClient } from '../client/client'
import { AssetWithBalanceRD } from '../wallet/types'
import { getPhrase } from '../wallet/util'
import { EthereumClientState } from './types'

const newClient = createClient(
  ETHChain,
  ([keystore, network]) => {
    const client: EthereumClientState = F.pipe(
      getPhrase(keystore),
      O.chain((phrase) => {
        try {
          const client = new EthereumClient(network, phrase)
          return O.some(right(client)) as EthereumClientState
        } catch (error) {
          return O.some(left(error))
        }
      })
    )

    return client
  },
  ETH_DECIMAL
)

const clientState$ = newClient.clientState$

export type ClientState = typeof clientState$

const client$: Observable<O.Option<EthereumClient>> = newClient.client$

const address$: Observable<O.Option<Address>> = newClient.address$

const reloadBalances = newClient.balances.reloadBalances

const assetWB$: Observable<AssetWithBalanceRD> = FP.pipe(
  newClient.balances.assetsWB$,
  liveData.map((s) => s[0])
  // liveData.map(s => ({...s, amount: s.amount()}))
)

/**
 * Object with all "public" functions and observables
 */
export { client$, address$, reloadBalances, assetWB$ }
