import { useCallback } from 'react'

import { Asset, assetToString } from '@xchainjs/xchain-util'
import { useHistory } from 'react-router-dom'

import * as walletRoutes from '../../../../routes/wallet'

export const useChangeAssetHandler = () => {
  const history = useHistory()

  const handler = useCallback(
    (asset: Asset) => {
      const path = walletRoutes.send.path({ asset: assetToString(asset) })
      history.push(path)
    },
    [history]
  )
  return handler
}
