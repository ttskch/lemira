import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import {yupResolver} from '@hookform/resolvers/yup'
import type {NextPage} from 'next'
import Head from 'next/head'
import {useState} from 'react'
import {FormProvider, useFieldArray, useForm} from 'react-hook-form'
import {AiOutlineCheck, AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai'
import * as yup from 'yup'
import {FormRow} from '@/components/molecules/FormRow'
import {NarrowBox} from '@/components/molecules/NarrowBox'
import {ResponsiveRow} from '@/components/molecules/ResponsiveRow'
import {PreviewModal} from '@/components/organisms/PreviewModal'
import {ProgressModal} from '@/components/organisms/ProgressModal'
import {ResultModal} from '@/components/organisms/ResultModal'
import {AppTemplate} from '@/components/templates/AppTemplate'

type Variable = {
  name: string
  values: string[]
}

export type Envelope = {
  smtp: {
    host: string
    port: number
    user: string
    password: string
  }
  from: string
  fromName?: string
  replyTo?: string
  subject: string
  body: string
  recipients: string[]
  variables: Variable[]
}

export type Result = {
  to: string
  success: boolean
  error?: string
}

type FormSchema = Envelope

const textToArray = (text: string | undefined) =>
  text?.split('\n').filter((v: string) => !!v) ?? []

const formSchema = yup
  .object({
    smtp: yup.object({
      host: yup.string().required('この項目は必須です。'),
      port: yup.number().required('この項目は必須です。'),
      user: yup.string().required('この項目は必須です。'),
      password: yup.string().required('この項目は必須です。'),
    }),
    from: yup
      .string()
      .email('メールアドレスが正しくありません。')
      .required('この項目は必須です。'),
    fromName: yup.string(),
    replyTo: yup.string().email('メールアドレスが正しくありません。'),
    subject: yup.string().required('この項目は必須です。'),
    body: yup.string().required('この項目は必須です。'),
    recipients: yup
      .array()
      .transform((value, originalValue) => textToArray(originalValue))
      .of(
        yup
          .string()
          .email(
            ({value}) => `"${value}" は正しいメールアドレスではありません。`,
          ),
      )
      .min(1, 'この項目は必須です。'),
    variables: yup.array().of(
      yup.object({
        name: yup
          .string()
          .required('この項目は必須です。')
          .test(
            'not-include-enclosure',
            '変数名に "%" を使うことはできません',
            (v) => v?.indexOf('%') === -1,
          )
          .test('unique', '変数名が重複しています。', function (self) {
            const {variables} = this.from?.[1].value ?? []
            const duplicateNames = variables
              .map((v: Variable) => v.name)
              .filter((v: string) => !!v)
              .filter((v: string, i: number, a: string[]) => a.indexOf(v) !== i)
            return duplicateNames.indexOf(self) === -1
          }),
        values: yup
          .array()
          .transform((value, originalValue) =>
            Array.isArray(originalValue)
              ? originalValue
              : textToArray(originalValue),
          )
          .of(yup.string())
          .test('length', '値の数が宛先の数と一致していません。', function (v) {
            const {recipients} = this.from?.[1].value ?? ''
            return v?.length === textToArray(recipients).length
          }),
      }),
    ),
  })
  .required()

export const applyVariables = (
  text: string,
  variables: Variable[],
  index: number,
) => {
  variables.forEach((variable) => {
    text = text.replaceAll(`%${variable.name}%`, variable.values[index])
  })

  return text
}

const Index: NextPage = () => {
  const {
    isOpen: previewModalIsOpen,
    onOpen: previewModalOnOpen,
    onClose: previewModalOnClose,
  } = useDisclosure()
  const {
    isOpen: progressModalIsOpen,
    onOpen: progressModalOnOpen,
    onClose: progressModalOnClose,
  } = useDisclosure()
  const {
    isOpen: resultModalIsOpen,
    onOpen: resultModalOnOpen,
    onClose: resultModalOnClose,
  } = useDisclosure()

  const formMethods = useForm<FormSchema>({
    resolver: yupResolver(formSchema),
  })
  const {
    fields: variables,
    append: appendVariable,
    remove: removeVariable,
  } = useFieldArray({
    control: formMethods.control,
    name: 'variables',
  })

  const [envelope, setEnvelope] = useState<Envelope | undefined>(undefined)
  const [total, setTotal] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [results, setResults] = useState<Result[]>([])

  const onAppendVariable = (name: string, values: string[]) => {
    appendVariable({name, values})
  }

  const onRemoveVariable = (index: number) => {
    removeVariable(index)
  }

  const onPreview = async (values: FormSchema) => {
    setEnvelope(values)
    previewModalOnOpen()
  }

  const onSend = async () => {
    if (!envelope) {
      return
    }

    previewModalOnClose()

    setTotal(envelope.recipients.length)
    progressModalOnOpen()

    for (let i = 0; i < envelope.recipients.length; i++) {
      const from = `${envelope.fromName} <${envelope.from}>`
      const replyTo = envelope.replyTo
      const to = envelope.recipients[i]
      const subject = applyVariables(envelope.subject, envelope.variables, i)
      const text = applyVariables(envelope.body, envelope.variables, i)

      const res = await fetch('/api/sendmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: envelope.smtp.host,
          port: envelope.smtp.port,
          user: envelope.smtp.user,
          pass: envelope.smtp.password,
          from,
          replyTo,
          to,
          subject,
          text,
        }),
      })

      setProgress(progress + 1)

      results.push({
        to,
        success: Math.floor(res.status / 100) === 2,
        error: (await res.json()).error,
      })
      setResults(results)
    }

    progressModalOnClose()
    setTotal(0)
    setProgress(0)

    resultModalOnOpen()
  }

  return (
    <AppTemplate>
      <Head>
        <title>Lemira</title>
        <meta name="description" content="Lemira" />
      </Head>

      <PreviewModal
        isOpen={previewModalIsOpen}
        onClose={previewModalOnClose}
        onSend={onSend}
        envelope={envelope}
      />
      <ProgressModal
        isOpen={progressModalIsOpen}
        onClose={progressModalOnClose}
        total={total}
        progress={progress}
      />
      <ResultModal
        isOpen={resultModalIsOpen}
        onClose={() => {
          resultModalOnClose()
          setResults([])
        }}
        results={results}
      />

      <Box bg="bgGray" h="100%">
        <NarrowBox py={{base: '1rem', sm: '3rem'}}>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onPreview)}>
              <Heading as="h2" fontSize="1.5rem" mb="1.5rem">
                送信に使用するSMTP情報
              </Heading>
              <Box mb="2rem">
                <FormRow
                  label="ホスト名"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.smtp?.host}
                  errorMessage={
                    formMethods.formState.errors.smtp?.host?.message
                  }
                >
                  <Input type="text" {...formMethods.register('smtp.host')} />
                </FormRow>
                <FormRow
                  label="ポート番号"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.smtp?.port}
                  errorMessage={
                    formMethods.formState.errors.smtp?.port?.message
                  }
                >
                  <Input type="number" {...formMethods.register('smtp.port')} />
                </FormRow>
                <FormRow
                  label="ユーザー名"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.smtp?.user}
                  errorMessage={
                    formMethods.formState.errors.smtp?.user?.message
                  }
                >
                  <Input type="text" {...formMethods.register('smtp.user')} />
                </FormRow>
                <FormRow
                  label="パスワード"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.smtp?.password}
                  errorMessage={
                    formMethods.formState.errors.smtp?.password?.message
                  }
                >
                  <Input
                    type="password"
                    {...formMethods.register('smtp.password')}
                  />
                </FormRow>
              </Box>
              <Heading as="h2" fontSize="1.5rem" mb="1.5rem">
                メールの内容
              </Heading>
              <Box mb="2rem">
                <FormRow
                  label="From"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.from}
                  errorMessage={formMethods.formState.errors.from?.message}
                >
                  <Input type="email" {...formMethods.register('from')} />
                </FormRow>
                <FormRow
                  label="差出人名"
                  isInvalid={!!formMethods.formState.errors.fromName}
                  errorMessage={formMethods.formState.errors.fromName?.message}
                >
                  <Input type="text" {...formMethods.register('fromName')} />
                </FormRow>
                <FormRow
                  label="ReplyTo"
                  isInvalid={!!formMethods.formState.errors.replyTo}
                  errorMessage={formMethods.formState.errors.replyTo?.message}
                >
                  <Input type="email" {...formMethods.register('replyTo')} />
                </FormRow>
                <FormRow
                  label="件名"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.subject}
                  errorMessage={formMethods.formState.errors.subject?.message}
                >
                  <Input type="text" {...formMethods.register('subject')} />
                  <FormHelperText>
                    ※<Code>%変数名%</Code> で変数を埋め込むことができます。
                  </FormHelperText>
                </FormRow>
                <FormRow
                  label="本文"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.body}
                  errorMessage={formMethods.formState.errors.body?.message}
                >
                  <Textarea rows={10} {...formMethods.register('body')} />
                  <FormHelperText>
                    ※<Code>%変数名%</Code> で変数を埋め込むことができます。
                  </FormHelperText>
                </FormRow>
                <FormRow
                  label="宛先"
                  isRequired
                  isInvalid={!!formMethods.formState.errors.recipients}
                  errorMessage={
                    formMethods.formState.errors.recipients?.message ??
                    formMethods.formState.errors.recipients
                      ?.map?.((error) => error?.message)
                      .find((message) => !!message)
                  }
                >
                  <Textarea
                    rows={5}
                    placeholder={`alice@example.com\nbob@example.com`}
                    {...formMethods.register('recipients')}
                  />
                  <FormHelperText>
                    ※改行区切りで複数入力できます。
                  </FormHelperText>
                </FormRow>
                <ResponsiveRow
                  left={
                    <FormLabel m={0} lineHeight="2.5rem">
                      埋め込み変数
                    </FormLabel>
                  }
                  right={
                    <Box mb="0.5rem">
                      {variables.map((variable, i) => (
                        <Flex
                          mb="0.3rem"
                          gap="0.5rem"
                          p="0.5rem"
                          borderWidth="1px"
                          borderRadius="0.375rem"
                          key={i}
                        >
                          <Box flexGrow={1}>
                            <FormControl
                              isInvalid={
                                !!formMethods.formState.errors.variables?.[i]
                                  ?.name
                              }
                            >
                              <InputGroup>
                                <InputLeftAddon>%</InputLeftAddon>
                                <Input
                                  type="text"
                                  placeholder="変数名"
                                  {...formMethods.register(
                                    `variables.${i}.name`,
                                  )}
                                />
                                <InputRightAddon>%</InputRightAddon>
                              </InputGroup>
                              <FormErrorMessage mt="0.1rem">
                                {
                                  formMethods.formState.errors.variables?.[i]
                                    ?.name?.message
                                }
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                          <Box flexGrow={1}>
                            <FormControl
                              isInvalid={
                                !!formMethods.formState.errors.variables?.[i]
                                  ?.values
                              }
                            >
                              <Textarea
                                rows={5}
                                placeholder={`宛先ごとの値\n...`}
                                {...formMethods.register(
                                  `variables.${i}.values`,
                                )}
                              />
                              <FormHelperText>
                                ※改行区切りで宛先と同じ数だけ入力してください。
                              </FormHelperText>
                              <FormErrorMessage mt="0.1rem">
                                {
                                  formMethods.formState.errors.variables?.[i]
                                    ?.values?.message
                                }
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                          <IconButton
                            aria-label="削除"
                            flexShrink={0}
                            variant="solid"
                            size="xl"
                            w="2.5rem"
                            h="2.5rem"
                            icon={<Icon as={AiOutlineMinus} />}
                            onClick={() => onRemoveVariable(i)}
                          />
                        </Flex>
                      ))}
                      <IconButton
                        aria-label="追加"
                        variant="solid"
                        size="xl"
                        w="100%"
                        h="2.5rem"
                        icon={<Icon as={AiOutlinePlus} />}
                        onClick={() => onAppendVariable('', [])}
                      />
                    </Box>
                  }
                />
              </Box>
              <Flex>
                <Button
                  type="submit"
                  ml="auto"
                  disabled={formMethods.formState.isSubmitting}
                >
                  <Icon as={AiOutlineCheck} mr="0.2rem" />
                  プレビュー
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </NarrowBox>
      </Box>
    </AppTemplate>
  )
}

export default Index
