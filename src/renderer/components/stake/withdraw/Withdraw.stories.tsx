import React from 'react'

import { storiesOf } from '@storybook/react'
import { Asset, AssetBNB, AssetRune67C, bn } from '@thorchain/asgardex-util'

import { Withdraw } from './Withdraw'

export const WithdrawStory: React.FC<{ stakedAsset?: Asset; runeAsset?: Asset }> = (props) => {
  return (
    <Withdraw
      stakedAsset={AssetBNB}
      runeAsset={AssetRune67C}
      assetPrice={bn(60.972)}
      runePrice={bn(1)}
      selectedCurrencyAsset={AssetRune67C}
      onWithdraw={console.log}
      runeShare={bn('193011422')}
      assetShare={bn('3202499')}
      {...props}
    />
  )
}

storiesOf('Components/Stake/Withdraw', module).add('default', () => <WithdrawStory />)