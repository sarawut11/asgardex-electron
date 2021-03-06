import { StakeMessages } from '../types'

const stake: StakeMessages = {
  'stake.share.title': 'Ваша общая доля в пуле',
  'stake.share.units': 'Liquidity units - RU',
  'stake.share.poolshare': 'Доля в пуле',
  'stake.share.total': 'Total value - RU',
  'stake.redemption.title': 'Current redemption value - RU',
  'stake.totalEarnings': 'Ваш общий доход от пула',
  'stake.add.asym': 'Добавить {asset}',
  'stake.add.sym': 'Добавить {assetA} + {assetB}',
  'stake.add.error.chainFeeNotCovered': 'Необходимая комиссия {fee} не покрывается вашим балансом: {balance}',
  'stake.add.error.nobalances': 'Нет средств',
  'stake.add.error.nobalance1': 'У вас нет средств на балансе {asset} в кошелке для вклада',
  'stake.add.error.nobalance2': 'У вас нет средств на балансах {asset1} и {asset2} в кошельке для вклада',
  'stake.withdraw': 'Убрать',
  'stake.advancedMode': 'Расширенный режим',
  'stake.drag': 'Потяните',
  'stake.poolDetails.depth': 'Глубина',
  'stake.poolDetails.24hvol': 'Количество за 24ч',
  'stake.poolDetails.allTimeVal': 'Количество за все время',
  'stake.poolDetails.totalSwaps': 'Всего свапов',
  'stake.poolDetails.totalStakers': 'Всего держателей',
  'stake.wallet.add': 'Добавить',
  'stake.wallet.connect': 'Пожалуйсста добавьте свой кошелек',
  'stake.pool.noStakes': 'У вас нет доли в этом пуле',
  'stake.withdraw.title': 'Установить вывод',
  'stake.withdraw.choseText': 'Выберите сколько вы хотите изять от 0% до 100%',
  'stake.withdraw.receiveText': 'Вы полчучите',
  'stake.withdraw.fee': 'Комиссия',
  'stake.withdraw.feeNote': 'Важно: {fee} BNB останется на вашем кошельке для покрытия комисий.',
  'stake.withdraw.drag': 'Перетащите для изъявтия'
}

export default stake
