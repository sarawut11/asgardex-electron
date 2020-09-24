import { NETWORK_PREFIX_MAPPING as BnbNetwork } from '@binance-chain/javascript-sdk/lib/client'
import { Address } from '@thorchain/asgardex-binance'
import { Network as BtcNetwork } from '@thorchain/asgardex-bitcoin'
import { Network as EthNetwork } from '@thorchain/asgardex-ethereum'
import { BNBChain, BTCChain, Chain, ETHChain, THORChain } from '@thorchain/asgardex-util'
import * as F from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Rx from 'rxjs'
import { Observable } from 'rxjs'
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators'

import { eqOString } from '../../helpers/fp/eq'
import { network$ } from '../app/service'
import { ClientState } from '../types'
import { getClient } from '../utils'
import { keystoreService } from '../wallet/service'
import { KeystoreState } from '../wallet/types'
import { createBalancesService } from './balances'
import { Client } from './helpers'

const networks = {
  [BNBChain]: {
    mainnet: 'mainnet',
    testnet: 'testnet',
    chaosnet: 'mainnet'
  },
  [BTCChain]: {
    mainnet: BtcNetwork.MAIN,
    testnet: BtcNetwork.TEST,
    chaosnet: BtcNetwork.TEST
  },
  [ETHChain]: {
    mainnet: EthNetwork.MAIN,
    testnet: EthNetwork.TEST,
    chaosnet: EthNetwork.MAIN
  },
  [THORChain]: {
    // as tmp
    mainnet: BnbNetwork.mainnet,
    testnet: BnbNetwork.testnet,
    chaosnet: BnbNetwork.testnet
  }
} as const

type InnerValues<T extends object> = T[keyof T]

export const createClient = <T extends Chain, C extends Client>(
  chain: T,
  clientConstructor: ([keystore, network]: [KeystoreState, InnerValues<typeof networks[T]>]) => ClientState<C>,
  deciaml: number
) => {
  const clientNetwork$ = network$.pipe(
    map((network) => (networks[chain][network] as unknown) as InnerValues<typeof networks[T]>)
  )

  /**
   * Stream to create an observable Client depending on existing phrase in keystore
   *
   * Whenever a phrase has been added to keystore, a new Client will be created.
   * By the other hand: Whenever a phrase has been removed, the client is set to `none`
   * A Client will never be created as long as no phrase is available
   */
  const clientState$ = F.pipe(Rx.combineLatest([keystoreService.keystore$, clientNetwork$]), map(clientConstructor))

  const client$ = F.pipe(clientState$, map(getClient), shareReplay(1))

  /**
   * Current `Address` depending on selected network
   *
   * If a client is not available (e.g. by removing keystore), it returns `None`
   *
   */
  const address$: Observable<O.Option<Address>> = client$.pipe(
    map(F.pipe(O.chain((client) => F.pipe(client.getAddress(), O.fromNullable)))),
    distinctUntilChanged(eqOString.equals),
    shareReplay(1)
  )

  const balances = createBalancesService(chain, client$, deciaml)

  return {
    client$,
    clientState$,
    address$,
    balances
  }
}
