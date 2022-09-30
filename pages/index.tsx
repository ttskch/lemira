import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputLeftAddon,
  InputGroup,
  FormHelperText,
  Textarea,
  InputRightAddon,
  Code,
} from '@chakra-ui/react'
import {yupResolver} from '@hookform/resolvers/yup'
import type {NextPage} from 'next'
import Head from 'next/head'
import {FormProvider, useFieldArray, useForm} from 'react-hook-form'
import {BiMinus, BiPlus, BiSend} from 'react-icons/bi'
import * as yup from 'yup'
import {NarrowBox} from '@/components/molecules/NarrowBox'
import {AppTemplate} from '@/components/templates/AppTemplate'

type Variable = {
  name: string
  values: string[]
}

type FormSchema = {
  from: string
  fromName?: string
  replyTo?: string
  subject: string
  body: string
  recipients: string[]
  variables: Variable[]
}

const textToArray = (text: string | undefined) =>
  text?.split('\n').filter((v: string) => !!v) ?? []

const formSchema = yup
  .object({
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

const Index: NextPage = () => {
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

  const onAppendVariable = (name: string, values: string[]) => {
    appendVariable({name, values})
  }

  const onRemoveVariable = (index: number) => {
    removeVariable(index)
  }

  const onSubmit = async (values: FormSchema) => {
    console.log(values)
  }

  return (
    <AppTemplate>
      <Head>
        <title>Lemira</title>
        <meta name="description" content="Lemira" />
      </Head>

      <Box bg="bgGray" h="100%">
        <NarrowBox py={{base: '1rem', sm: '3rem'}}>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <FormControl
                isRequired
                isInvalid={!!formMethods.formState.errors.from}
                mb="0.5rem"
              >
                <FormLabel>From</FormLabel>
                <Input type="email" {...formMethods.register('from')} />
                <FormErrorMessage mt="0.1rem">
                  {formMethods.formState.errors.from?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!formMethods.formState.errors.fromName}
                mb="0.5rem"
              >
                <FormLabel>差出人名</FormLabel>
                <Input type="text" {...formMethods.register('fromName')} />
                <FormErrorMessage mt="0.1rem">
                  {formMethods.formState.errors.fromName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!formMethods.formState.errors.replyTo}
                mb="0.5rem"
              >
                <FormLabel>ReplyTo</FormLabel>
                <Input type="email" {...formMethods.register('replyTo')} />
                <FormErrorMessage mt="0.1rem">
                  {formMethods.formState.errors.replyTo?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!formMethods.formState.errors.subject}
                mb="0.5rem"
              >
                <FormLabel>件名</FormLabel>
                <Input type="text" {...formMethods.register('subject')} />
                <FormHelperText>
                  ※<Code>%変数名%</Code> で変数を埋め込むことができます。
                </FormHelperText>
                <FormErrorMessage mt="0.1rem">
                  {formMethods.formState.errors.subject?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!formMethods.formState.errors.body}
                mb="0.5rem"
              >
                <FormLabel>本文</FormLabel>
                <Textarea rows={10} {...formMethods.register('body')} />
                <FormHelperText>
                  ※<Code>%変数名%</Code> で変数を埋め込むことができます。
                </FormHelperText>
                <FormErrorMessage mt="0.1rem">
                  {formMethods.formState.errors.body?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!formMethods.formState.errors.recipients}
                mb="0.5rem"
              >
                <FormLabel>宛先</FormLabel>
                <Textarea
                  rows={5}
                  placeholder={`alice@example.com\nbob@example.com`}
                  {...formMethods.register('recipients')}
                />
                <FormHelperText>※改行区切りで複数入力できます。</FormHelperText>
                <FormErrorMessage mt="0.1rem">
                  {formMethods.formState.errors.recipients?.message ??
                    formMethods.formState.errors.recipients
                      ?.map?.((error) => error?.message)
                      .find((message) => !!message)}
                </FormErrorMessage>
              </FormControl>
              <FormLabel>埋め込み変数</FormLabel>
              <Box mb="1.5rem">
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
                          !!formMethods.formState.errors.variables?.[i]?.name
                        }
                      >
                        <InputGroup>
                          <InputLeftAddon>%</InputLeftAddon>
                          <Input
                            type="text"
                            placeholder="変数名"
                            {...formMethods.register(`variables.${i}.name`)}
                          />
                          <InputRightAddon>%</InputRightAddon>
                        </InputGroup>
                        <FormErrorMessage mt="0.1rem">
                          {
                            formMethods.formState.errors.variables?.[i]?.name
                              ?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box flexGrow={1}>
                      <FormControl
                        isInvalid={
                          !!formMethods.formState.errors.variables?.[i]?.values
                        }
                      >
                        <Textarea
                          rows={5}
                          placeholder={`宛先ごとの値\n...`}
                          {...formMethods.register(`variables.${i}.values`)}
                        />
                        <FormHelperText>
                          ※改行区切りで宛先と同じ数だけ入力してください。
                        </FormHelperText>
                        <FormErrorMessage mt="0.1rem">
                          {
                            formMethods.formState.errors.variables?.[i]?.values
                              ?.message
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
                      icon={<Icon as={BiMinus} />}
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
                  icon={<Icon as={BiPlus} />}
                  onClick={() => onAppendVariable('', [])}
                />
              </Box>
              <Flex>
                <Button
                  type="submit"
                  variant="primary"
                  ml="auto"
                  disabled={formMethods.formState.isSubmitting}
                >
                  <Icon as={BiSend} mr="0.2rem" />
                  送信
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
