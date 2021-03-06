import React, { useState, useCallback, useMemo } from 'react'

import { generatePhrase } from '@xchainjs/xchain-crypto'
import Form, { Rule } from 'antd/lib/form'
import { useIntl } from 'react-intl'

import { Button, RefreshButton } from '../../uielements/button'
import { InputPassword as Input } from '../../uielements/input'
import { Phrase } from './index'
import * as Styled from './NewPhrase.styles'
import { PhraseInfo } from './Phrase.types'

type Props = {
  onSubmit: (info: PhraseInfo) => void
}

export type FormValues = {
  password: string
}

export const NewPhraseGenerate: React.FC<Props> = ({ onSubmit }: Props): JSX.Element => {
  const [loadingMsg, setLoadingMsg] = useState<string>('')
  const intl = useIntl()

  const [phrase, setPhrase] = useState(generatePhrase())

  const phraseWords = useMemo(() => phrase.split(' ').map((word) => ({ text: word, _id: word })), [phrase])

  const [form] = Form.useForm<FormValues>()

  const handleFormFinish = useCallback(
    ({ password }: FormValues) => {
      try {
        setLoadingMsg(intl.formatMessage({ id: 'wallet.create.creating' }) + '...')
        onSubmit({ phrase, password: password })
      } catch (err) {
        setLoadingMsg('')
      }
    },
    [onSubmit, phrase, intl]
  )

  const rules: Rule[] = useMemo(
    () => [
      { required: true },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve()
          }
          return Promise.reject(intl.formatMessage({ id: 'wallet.create.password.mismatch' }))
        }
      })
    ],
    [intl]
  )

  const copyPhraseToClipborad = useCallback(() => {
    navigator.clipboard.writeText(phrase)
  }, [phrase])
  return (
    <>
      <Styled.TitleContainer justify="space-between">
        <Styled.SectionTitle copyable={{ onCopy: copyPhraseToClipborad }}>
          {intl.formatMessage({ id: 'wallet.create.copy.phrase' })}
        </Styled.SectionTitle>
        <RefreshButton clickHandler={() => setPhrase(generatePhrase())} />
      </Styled.TitleContainer>
      <Phrase words={phraseWords} readOnly={true} />
      <Styled.Form form={form} onFinish={handleFormFinish} labelCol={{ span: 24 }}>
        <Styled.PasswordContainer>
          <Styled.PasswordItem name="password" validateTrigger={['onSubmit', 'onBlur']} rules={rules}>
            <Input
              size="large"
              type="password"
              placeholder={intl.formatMessage({ id: 'common.password' }).toUpperCase()}
            />
          </Styled.PasswordItem>
          <Styled.PasswordItem
            name="repeatPassword"
            dependencies={['password']}
            validateTrigger={['onSubmit', 'onBlur']}
            rules={rules}>
            <Input
              size="large"
              type="password"
              placeholder={intl.formatMessage({ id: 'wallet.create.password.repeat' }).toUpperCase()}
            />
          </Styled.PasswordItem>
        </Styled.PasswordContainer>
        <Styled.SubmitItem>
          <Button size="large" type="primary" round="true" htmlType="submit">
            {loadingMsg || intl.formatMessage({ id: 'common.next' })}
          </Button>
        </Styled.SubmitItem>
      </Styled.Form>
    </>
  )
}
