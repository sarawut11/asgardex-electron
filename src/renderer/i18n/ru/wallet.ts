import { WalletMessages } from '../types'

const wallet: WalletMessages = {
  'wallet.nav.stakes': 'Stakes',
  'wallet.nav.bonds': 'Bonds',
  'wallet.column.name': 'Имя',
  'wallet.column.ticker': 'Ticker',
  'wallet.column.balance': 'Баланс',
  'wallet.column.value': 'Количество',
  'wallet.action.send': 'Отправить',
  'wallet.action.receive': 'Получить',
  'wallet.action.remove': 'Удалить кошелек',
  'wallet.action.unlock': 'Разблокировать',
  'wallet.action.import': 'Импортировать',
  'wallet.action.create': 'Создать',
  'wallet.action.connect': 'Connect - RU',
  'wallet.connect.instruction': 'Пожалуйста подключите ваш кошелек',
  'wallet.unlock.title': 'Разблокировать кошелек',
  'wallet.unlock.instruction': 'Пожалуйста разблокируйте ваш кошелек',
  'wallet.unlock.phrase': 'Введите ваш пароль',
  'wallet.unlock.error': 'Не получилось разблокировать кошелек. Пожалуйста, проверьте пароль и попробуйте еще раз',
  'wallet.imports.phrase': 'Фраза',
  'wallet.imports.wallet': 'Импортировать существующий кошелек',
  'wallet.imports.enterphrase': 'Введите фразу',
  'wallet.txs.last90days': 'Транзакции за последние 90 дней',
  'wallet.empty.phrase.import': 'Импортировать существующий кошелек с балансом',
  'wallet.empty.phrase.create': 'Создать новый кошелек с балансом',
  'wallet.create.copy.phrase': 'Скопируйте фразу ниже',
  'wallet.create.title': 'Создать новый кошелек',
  'wallet.create.enter.phrase': 'Введите правильную фразу',
  'wallet.create.words.click': ' Выберите слова в правильном порядке',
  'wallet.create.creating': 'Создание кошелька',
  'wallet.create.password.repeat': 'Повторите парроль',
  'wallet.create.password.mismatch': 'Пароли не совпадают',
  'wallet.create.error': 'Ошибка при сохранении фрразы',
  'wallet.receive.address.error': 'Нет доступных адресов для получения',
  'wallet.receive.address.errorQR': 'Ошибка при создании QR-кода: {error}',
  'wallet.send.success': 'Тразакция завершена',
  'wallet.send.fastest': 'Быстро',
  'wallet.send.fast': 'Быстро',
  'wallet.send.average': 'Средне',
  'wallet.errors.balancesFailed': 'Нет загруженных балансов. {errorMsg} (API Id: {apiId})',
  'wallet.errors.address.empty': 'Адрес не может быть путсым',
  'wallet.errors.address.invalid': 'Адес недействителен',
  'wallet.errors.amount.shouldBeNumber': 'Количество должно быть числом',
  'wallet.errors.amount.shouldBeGreaterThan': 'Количество должно быть больше, чем {amount}',
  'wallet.errors.amount.shouldBeLessThanBalance': 'Количество должно быть меньше вашего баланса',
  'wallet.errors.amount.shouldBeLessThanBalanceAndFee':
    'Количество должно быть меньше, чем ваш баланс после вычета комисси',
  'wallet.errors.fee.notCovered': ' Комиссия не покрывается вашим банаслом ({balance})',
  'wallet.errors.invalidChain': 'Цепь недействительна',
  'wallet.password.confirmation': 'Подтверждение пароля',
  'wallet.password.confirmation.pending': 'Проверка пароля',
  'wallet.password.confirmation.error': 'Неверный пароль'
}

export default wallet
