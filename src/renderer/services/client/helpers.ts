import { Balances } from '@thorchain/asgardex-binance'
import { Asset, AssetBNB, AssetBTC, AssetETH, BNBChain, BTCChain, Chain, ETHChain } from '@thorchain/asgardex-util'
import { ethers } from 'ethers'

export interface Client {
  getAddress: () => string | undefined
  getBalance: () => Promise<ethers.BigNumberish | Balances | number>
}

export const assetByChain = (chain: Chain): Asset => {
  switch (chain) {
    case BNBChain: {
      return AssetBNB
    }
    case BTCChain: {
      return AssetBTC
    }
    case ETHChain: {
      return AssetETH
    }
    default: {
      return AssetBNB
    }
  }
}
