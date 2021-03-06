import { bnOrZero, PoolData, assetFromString, Asset, Chain } from '@xchainjs/xchain-util'
import BigNumber from 'bignumber.js'
import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as Ord from 'fp-ts/lib/Ord'

import { ONE_ASSET_BASE_AMOUNT } from '../const'
import { Network } from '../services/app/types'
import { PoolDetails } from '../services/midgard/types'
import { PoolDetail } from '../types/generated/midgard'
import { PoolTableRowData, PoolTableRowsData, PricePool } from '../views/pools/Pools.types'
import { getPoolTableRowData } from '../views/pools/Pools.utils'
import { getDefaultRuneAsset } from './assetHelper'
import { ordBaseAmount } from './fp/ord'
import { sequenceTOption, sequenceTOptionFromArray } from './fpHelpers'

export const sortByDepth = (a: PoolTableRowData, b: PoolTableRowData) =>
  ordBaseAmount.compare(a.depthPrice, b.depthPrice)

const ordByDepth = Ord.ord.contramap(ordBaseAmount, ({ depthPrice }: PoolTableRowData) => depthPrice)

/**
 * Helper to create a RUNE based `PricePool`
 *
 * Note: We don't have a "RUNE" pool in THORChain, but do need such thing for pricing
 */
export const getRunePricePool = (runeAsset: Asset): PricePool => ({
  asset: runeAsset,
  poolData: { assetBalance: ONE_ASSET_BASE_AMOUNT, runeBalance: ONE_ASSET_BASE_AMOUNT }
})

/**
 * Returns default RUNE based `PricePool`
 *
 * Note: We don't have a "RUNE" pool in THORChain, but do need such thing for pricing
 */
export const getDefaultRunePricePool = (chain: Chain = 'BNB') => getRunePricePool(getDefaultRuneAsset(chain))

export const getPoolTableRowsData = ({
  poolDetails,
  pricePoolData,
  network
}: {
  poolDetails: PoolDetails
  pricePoolData: PoolData
  network: Network
}): PoolTableRowsData => {
  // get symbol of deepest pool
  const oDeepestPoolSymbol: O.Option<string> = FP.pipe(
    poolDetails,
    getDeepestPool,
    O.chain((poolDetail) => O.fromNullable(poolDetail.asset)),
    O.chain((assetString) => O.fromNullable(assetFromString(assetString))),
    O.map(({ symbol }) => symbol)
  )

  // Transform `PoolDetails` -> PoolRowType
  return FP.pipe(
    poolDetails,
    A.mapWithIndex<PoolDetail, O.Option<PoolTableRowData>>((index, poolDetail) => {
      // get symbol of PoolDetail
      const oPoolDetailSymbol: O.Option<string> = FP.pipe(
        O.fromNullable(assetFromString(poolDetail.asset ?? '')),
        O.map(({ symbol }) => symbol)
      )
      // compare symbols to set deepest pool
      const deepest = FP.pipe(
        sequenceTOption(oDeepestPoolSymbol, oPoolDetailSymbol),
        O.fold(
          () => false,
          ([deepestPoolSymbol, poolDetailSymbol]) => Eq.eqString.equals(deepestPoolSymbol, poolDetailSymbol)
        )
      )

      return FP.pipe(
        getPoolTableRowData({ poolDetail, pricePoolData, network }),
        O.map(
          (poolTableRowData) =>
            ({
              ...poolTableRowData,
              key: poolDetail?.asset || index.toString(),
              deepest
            } as PoolTableRowData)
        )
      )
    }),
    sequenceTOptionFromArray,
    O.getOrElse(() => [] as PoolTableRowsData),
    // Table does not accept `defaultSortOrder` for depth  for any reason,
    // that's why we sort depth here
    A.sortBy([ordByDepth]),
    // descending sort
    A.reverse
  )
}

/**
 * Filters a pool out with hightest value of run
 */
export const getDeepestPool = (pools: PoolDetails): O.Option<PoolDetail> =>
  pools.reduce((acc: O.Option<PoolDetail>, pool: PoolDetail) => {
    const runeDepth = bnOrZero(pool.runeDepth)
    const prev = O.toNullable(acc)
    return runeDepth.isGreaterThanOrEqualTo(bnOrZero(prev?.runeDepth)) ? O.some(pool) : acc
  }, O.none)

/**
 * Converts Asset's pool price according to runePrice in selectedPriceAsset
 */
export const getAssetPoolPrice = (runePrice: BigNumber) => (poolDetail: PoolDetail) =>
  bnOrZero(poolDetail.price).multipliedBy(runePrice)
