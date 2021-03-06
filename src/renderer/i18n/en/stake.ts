import { StakeMessages } from '../types'

const stake: StakeMessages = {
  'stake.share.title': 'Your pool share',
  'stake.share.units': 'Liquidity units',
  'stake.share.total': 'Total value',
  'stake.share.poolshare': 'Pool share',
  'stake.redemption.title': 'Current redemption value',
  'stake.totalEarnings': 'Your total earnings from the pool',
  'stake.add.asym': 'Add {asset}',
  'stake.add.sym': 'Add {assetA} + {assetB}',
  'stake.add.error.chainFeeNotCovered': 'Needed fee of {fee} is not covered by your balance: {balance}',
  'stake.add.error.nobalances': 'No balances',
  'stake.add.error.nobalance1': "You don't have any balance of {asset} in your wallet to deposit.",
  'stake.add.error.nobalance2': "You don't have any balances of {asset1} and {asset2} in your wallet to deposit.",
  'stake.withdraw': 'Withdraw',
  'stake.advancedMode': 'Advanced mode',
  'stake.drag': 'Drag to stake',
  'stake.poolDetails.depth': 'Depth',
  'stake.poolDetails.24hvol': '24hr volume',
  'stake.poolDetails.allTimeVal': 'All time volume',
  'stake.poolDetails.totalSwaps': 'Total swaps',
  'stake.poolDetails.totalStakers': 'Total stakers',
  'stake.wallet.add': 'Add wallet',
  'stake.wallet.connect': 'Please connect your wallet',
  'stake.pool.noStakes': "You don't have any shares in this pool",
  'stake.withdraw.title': 'Adjust withdrawal',
  'stake.withdraw.choseText': 'Choose from 0 to 100% of how much to withdraw.',
  'stake.withdraw.receiveText': 'You should receive.',
  'stake.withdraw.fee': 'Fee',
  'stake.withdraw.feeNote': 'Note: {fee} BNB will be left in your wallet for the transaction fees.',
  'stake.withdraw.drag': 'Drag to withdraw'
}

export default stake
