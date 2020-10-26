import { getDepositMemo } from '@thorchain/asgardex-util'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { BASE_CHAIN } from '../../const'
import { eqChain } from '../../helpers/fp/eq'
import { sequenceTOption } from '../../helpers/fpHelpers'
import { selectedPoolAsset$ } from '../midgard/common'
import { baseAddress$, crossAddress$ } from './address'
import { MemoRx } from './types'

/**
 * Stake memo for txs sent on base-chain
 */
const baseChainStakeMemo$: MemoRx = Rx.combineLatest([selectedPoolAsset$, crossAddress$]).pipe(
  RxOp.map(([oPoolAsset, oCrossAddress]) =>
    FP.pipe(
      oPoolAsset,
      // Deposit for base-chain asset?
      O.filter((poolAsset) => eqChain.equals(poolAsset.chain, BASE_CHAIN)),
      // for base-chain deposits no need to add an address
      O.map(getDepositMemo),
      // for x-chain deposits, a wallet address for x-chain is needed
      O.alt(() =>
        FP.pipe(
          sequenceTOption(oPoolAsset, oCrossAddress),
          O.map(([poolAsset, crossAddress]) => getDepositMemo(poolAsset, crossAddress))
        )
      )
    )
  )
)

/**
 * Stake memo for txs sent on cross-chain
 */
const crossChainStakeMemo$: MemoRx = Rx.combineLatest([selectedPoolAsset$, baseAddress$]).pipe(
  RxOp.map(([oPoolAsset, oBaseAddress]) =>
    FP.pipe(
      sequenceTOption(oPoolAsset, oBaseAddress),
      // cross-chain asset?
      O.filter(([poolAsset]) => !eqChain.equals(poolAsset.chain, BASE_CHAIN)),
      // add address of base-chain wallet to memo
      O.map(([poolAsset, baseAddress]) => getDepositMemo(poolAsset, baseAddress))
    )
  )
)

// TODO(@veado) Remove it later, but leave it for #537 https://github.com/thorchain/asgardex-electron/issues/537
crossChainStakeMemo$.subscribe((value) => console.log('crossChainStakeMemo:', value))
baseChainStakeMemo$.subscribe((value) => console.log('baseChainStakeMemo:', value))

export { baseChainStakeMemo$, crossChainStakeMemo$ }