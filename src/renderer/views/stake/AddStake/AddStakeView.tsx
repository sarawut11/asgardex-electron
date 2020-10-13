import React, { useCallback } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { Asset, assetToString, bn, bnOrZero } from '@thorchain/asgardex-util'
import * as FP from 'fp-ts/function'
import * as O from 'fp-ts/lib/Option'
import { useObservableState } from 'observable-hooks'
import { useHistory } from 'react-router'
import * as RxOp from 'rxjs/operators'

import { AddStake } from '../../../components/stake/AddStake/AddStake'
import { ZERO_BASE_AMOUNT, ZERO_BN } from '../../../const'
import { useMidgardContext } from '../../../contexts/MidgardContext'
import { useWalletContext } from '../../../contexts/WalletContext'
import { getDefaultRuneAsset } from '../../../helpers/assetHelper'
import { sequenceTRD } from '../../../helpers/fpHelpers'
import * as stakeRoutes from '../../../routes/stake'
import { PoolDetailRD } from '../../../services/midgard/types'
import { getPoolDetail, toPoolData } from '../../../services/midgard/utils'
import { getBalanceByAsset } from '../../../services/wallet/util'

export const AddStakeView: React.FC<{ asset: Asset }> = ({ asset }) => {
  const history = useHistory()

  const onChangeAsset = useCallback(
    (asset: Asset) => {
      history.replace(stakeRoutes.stake.path({ asset: assetToString(asset) }))
    },
    [history]
  )

  const {
    service: {
      pools: { availableAssets$, priceRatio$, runeAsset$, selectedPricePoolAsset$, poolDetail$, poolsState$ }
    }
  } = useMidgardContext()

  const { assetsWBState$ } = useWalletContext()

  const runeAsset = useObservableState(runeAsset$, getDefaultRuneAsset(asset.chain))
  const runPrice = useObservableState(priceRatio$, bn(1))
  const [selectedPricePoolAsset] = useObservableState(() => FP.pipe(selectedPricePoolAsset$, RxOp.map(O.toUndefined)))

  const [assetsWB] = useObservableState(
    () =>
      FP.pipe(
        assetsWBState$,
        RxOp.map((assetsWBState) => assetsWBState.assetsWB)
      ),
    O.none
  )

  const poolDetailRD = useObservableState<PoolDetailRD>(poolDetail$, RD.initial)

  const assetBalance = FP.pipe(
    assetsWB,
    O.chain(getBalanceByAsset(asset)),
    O.map((assetWithAmount) => {
      return assetWithAmount.amount
    }),
    O.getOrElse(() => ZERO_BASE_AMOUNT)
  )

  const runeBalance = FP.pipe(
    assetsWB,
    O.chain(getBalanceByAsset(runeAsset)),
    O.map((assetWithAmount) => assetWithAmount.amount),
    O.getOrElse(() => ZERO_BASE_AMOUNT)
  )

  const poolsStateRD = useObservableState(poolsState$, RD.initial)

  const poolsState = FP.pipe(
    poolsStateRD,
    RD.chain((poolsState) => RD.fromOption(getPoolDetail(poolsState.poolDetails, asset), () => Error('no data')))
  )

  const poolAssetsRD = useObservableState(availableAssets$, RD.initial)

  const assetPriceRD = FP.pipe(
    poolsState,
    // convert from RUNE price to selected pool asset price
    RD.map((state) => bnOrZero(state.price).multipliedBy(runPrice))
  )

  const renderDisabledAddStake = useCallback(
    () => (
      <AddStake
        onChangeAsset={() => {}}
        asset={asset}
        runeAsset={runeAsset}
        assetPrice={ZERO_BN}
        runePrice={ZERO_BN}
        assetBalance={ZERO_BASE_AMOUNT}
        runeBalance={ZERO_BASE_AMOUNT}
        onStake={() => {}}
        priceAsset={selectedPricePoolAsset}
        disabled={true}
        poolData={{ runeBalance: ZERO_BASE_AMOUNT, assetBalance: ZERO_BASE_AMOUNT }}
      />
    ),
    [asset, runeAsset, selectedPricePoolAsset]
  )

  return FP.pipe(
    sequenceTRD(assetPriceRD, poolAssetsRD, poolDetailRD),
    RD.fold(
      renderDisabledAddStake,
      renderDisabledAddStake,
      renderDisabledAddStake,
      ([assetPrice, poolAssets, pool]) => {
        return (
          <AddStake
            poolData={toPoolData(pool)}
            onChangeAsset={onChangeAsset}
            asset={asset}
            runeAsset={runeAsset}
            assetPrice={assetPrice}
            runePrice={runPrice}
            assetBalance={assetBalance}
            runeBalance={runeBalance}
            onStake={console.log}
            priceAsset={selectedPricePoolAsset}
            assets={poolAssets}
          />
        )
      }
    )
  )
}