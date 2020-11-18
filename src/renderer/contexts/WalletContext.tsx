import React, { createContext, useContext } from 'react'

import { Events, Keyring } from '@shapeshiftoss/hdwallet-core'
import { WebUSBLedgerAdapter } from '@shapeshiftoss/hdwallet-ledger-webusb'
import * as O from 'fp-ts/lib/Option'
import { none, Option, some } from 'fp-ts/lib/Option'

import {
  reloadBalances,
  assetsWBState$,
  assetsWBChains$,
  reloadBalances$,
  keystoreService,
  selectedAsset$,
  loadTxs,
  getExplorerTxUrl$,
  txs$,
  setSelectedAsset,
  resetTxsPage
} from '../services/wallet/context'

let hdWallet

const initializeHDWallet = async () => {
  const keyring = new Keyring()
  const ledgerAdapter = WebUSBLedgerAdapter.useKeyring(keyring)

  keyring.on(['*', '*', Events.CONNECT], async (deviceId) => {
    hdWallet = keyring.get(deviceId)
  })

  try {
    await ledgerAdapter.initialize()
  } catch (e) {
    console.error('Could not initialize LedgerAdapter', e)
  }

  for (const [deviceID] of Object.entries(keyring.wallets)) {
    hdWallet = keyring.get(deviceID)
  }

  hdWallet = keyring.get()
  if (hdWallet) {
    if (hdWallet.transport) {
      await hdWallet.transport.connect()
    }
    // Initializing a native wallet will immediately prompt for the mnemonic
    if ((await hdWallet.getModel()) !== 'Native') {
      await hdWallet.initialize()
    }
  } else {
    try {
      hdWallet = await ledgerAdapter.pairDevice()
    } catch (e) {
      console.log('initializeHDWallet > ', e)
    }
  }
}

initializeHDWallet()

type WalletContextValue = {
  keystoreService: typeof keystoreService
  reloadBalances: typeof reloadBalances
  assetsWBState$: typeof assetsWBState$
  assetsWBChains$: typeof assetsWBChains$
  loadTxs: typeof loadTxs
  reloadBalances$: typeof reloadBalances$
  getExplorerTxUrl$: typeof getExplorerTxUrl$
  selectedAsset$: typeof selectedAsset$
  txs$: typeof txs$
  setSelectedAsset: typeof setSelectedAsset
  resetTxsPage: typeof resetTxsPage
  hdWallet: typeof hdWallet
}

const initialContext: WalletContextValue = {
  keystoreService,
  reloadBalances,
  reloadBalances$,
  loadTxs,
  assetsWBState$,
  assetsWBChains$,
  getExplorerTxUrl$,
  selectedAsset$,
  txs$,
  setSelectedAsset,
  resetTxsPage,
  hdWallet
}
const WalletContext = createContext<Option<WalletContextValue>>(none)

export const WalletProvider: React.FC = ({ children }): JSX.Element => (
  <WalletContext.Provider value={some(initialContext)}>{children}</WalletContext.Provider>
)

export const useWalletContext = () => {
  const context = O.toNullable(useContext(WalletContext))
  if (!context) {
    throw new Error('Context must be used within a WalletProvider.')
  }
  return context
}
