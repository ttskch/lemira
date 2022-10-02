import {
  Alert,
  AlertIcon,
  Box,
  Button,
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
import {useState} from 'react'
import {FormProvider, useFieldArray, useForm} from 'react-hook-form'
import {AiOutlineCheck, AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai'
import * as yup from 'yup'
import {FormRow} from '@/components/molecules/FormRow'
import {Head} from '@/components/molecules/Head'
import {NarrowBox} from '@/components/molecules/NarrowBox'
import {ResponsiveRow} from '@/components/molecules/ResponsiveRow'
import {PreviewModal} from '@/components/organisms/PreviewModal'
import {ProgressModal} from '@/components/organisms/ProgressModal'
import {ResultModal} from '@/components/organisms/ResultModal'
import {AppTemplate} from '@/components/templates/AppTemplate'
import {pagesPath} from '@/lib/$path'
import {applyVariables, Envelope, Result, Variable} from '@/lib/domain'
import {Translation, useLocale} from '@/lib/i18n'

type FormSchema = Envelope

const textToArray = (text: string | undefined) =>
  text?.split('\n').filter((v: string) => !!v) ?? []

const getFormSchema = (t: Translation) =>
  yup
    .object({
      smtp: yup.object({
        host: yup.string().required(t.pages.index.validation.required),
        port: yup
          .number()
          .integer(t.pages.index.validation.integer)
          .required(t.pages.index.validation.required),
        user: yup.string().required(t.pages.index.validation.required),
        password: yup.string().required(t.pages.index.validation.required),
      }),
      from: yup
        .string()
        .email(t.pages.index.validation.email)
        .required(t.pages.index.validation.required),
      fromName: yup.string(),
      replyTo: yup.string().email(t.pages.index.validation.email),
      subject: yup.string().required(t.pages.index.validation.required),
      body: yup.string().required(t.pages.index.validation.required),
      recipients: yup
        .array()
        .transform((value, originalValue) => textToArray(originalValue))
        .of(yup.string().email(t.pages.index.validation.oneOfEmails))
        .min(1, t.pages.index.validation.required),
      variables: yup.array().of(
        yup.object({
          name: yup
            .string()
            .required(t.pages.index.validation.required)
            .test(
              'not-include-enclosure',
              t.pages.index.validation.variableName,
              (v) => v?.indexOf('%') === -1,
            )
            .test(
              'unique',
              t.pages.index.validation.VariableNameDuplication,
              function (self) {
                const {variables} = this.from?.[1].value ?? []
                const duplicateNames = variables
                  .map((v: Variable) => v.name)
                  .filter((v: string) => !!v)
                  .filter(
                    (v: string, i: number, a: string[]) => a.indexOf(v) !== i,
                  )
                return duplicateNames.indexOf(self) === -1
              },
            ),
          values: yup
            .array()
            .transform((value, originalValue) =>
              Array.isArray(originalValue)
                ? originalValue
                : textToArray(originalValue),
            )
            .of(yup.string())
            .test('length', t.pages.index.validation.valuesCount, function (v) {
              const {recipients} = this.from?.[1].value ?? ''
              return v?.length === textToArray(recipients).length
            }),
        }),
      ),
    })
    .required()

const Index: NextPage = () => {
  const {t} = useLocale()

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
    resolver: yupResolver(getFormSchema(t)),
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
      throw 'Envelope is empty.'
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
      <Head
        title={t.pages.index.Head.title}
        description={t.pages.index.Head.description}
        path={pagesPath.$url().pathname}
      />

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

      <NarrowBox pt="1.5rem" pb={{base: '1rem', sm: '3rem'}}>
        <Alert status="info" bg="blue.50" mb="1.5rem">
          <AlertIcon />
          {
            t.pages.index[
              "You can send broadcast email via your own SMTP server from Lemira. Don't worry, we DO NOT store your credentials."
            ]
          }
        </Alert>

        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onPreview)}>
            <Heading
              as="h2"
              fontSize="1.5rem"
              mb={{base: '1rem', sm: '1.5rem'}}
            >
              {t.pages.index['SMTP Credentials']}
            </Heading>
            <Box mb={{base: '1rem', sm: '2rem'}}>
              <FormRow
                label={t.pages.index.Host}
                isRequired
                isInvalid={!!formMethods.formState.errors.smtp?.host}
                errorMessage={formMethods.formState.errors.smtp?.host?.message}
              >
                <Input
                  autoFocus
                  type="text"
                  placeholder="smtp.example.com"
                  {...formMethods.register('smtp.host')}
                />
              </FormRow>
              <FormRow
                label={t.pages.index.Port}
                isRequired
                isInvalid={!!formMethods.formState.errors.smtp?.port}
                errorMessage={formMethods.formState.errors.smtp?.port?.message}
              >
                <Input
                  type="number"
                  placeholder="465"
                  {...formMethods.register('smtp.port')}
                />
              </FormRow>
              <FormRow
                label={t.pages.index.User}
                isRequired
                isInvalid={!!formMethods.formState.errors.smtp?.user}
                errorMessage={formMethods.formState.errors.smtp?.user?.message}
              >
                <Input
                  type="text"
                  placeholder="user@example.com"
                  {...formMethods.register('smtp.user')}
                />
              </FormRow>
              <FormRow
                label={t.pages.index.Password}
                isRequired
                isInvalid={!!formMethods.formState.errors.smtp?.password}
                errorMessage={
                  formMethods.formState.errors.smtp?.password?.message
                }
                mb={0}
              >
                <Input
                  type="password"
                  placeholder="••••••••••"
                  {...formMethods.register('smtp.password')}
                />
              </FormRow>
            </Box>
            <Heading
              as="h2"
              fontSize="1.5rem"
              mb={{base: '1rem', sm: '1.5rem'}}
            >
              {t.pages.index['Email Content']}
            </Heading>
            <Box mb={{base: '1rem', sm: '2rem'}}>
              <FormRow
                label="From"
                isRequired
                isInvalid={!!formMethods.formState.errors.from}
                errorMessage={formMethods.formState.errors.from?.message}
              >
                <Input
                  type="email"
                  placeholder="noreply@example.com"
                  {...formMethods.register('from')}
                />
              </FormRow>
              <FormRow
                label={t.pages.index['Sender name']}
                isInvalid={!!formMethods.formState.errors.fromName}
                errorMessage={formMethods.formState.errors.fromName?.message}
              >
                <Input
                  type="text"
                  placeholder={t.pages.index['John Smith']}
                  {...formMethods.register('fromName')}
                />
              </FormRow>
              <FormRow
                label="ReplyTo"
                isInvalid={!!formMethods.formState.errors.replyTo}
                errorMessage={formMethods.formState.errors.replyTo?.message}
              >
                <Input
                  type="email"
                  placeholder="info@example.com"
                  {...formMethods.register('replyTo')}
                />
              </FormRow>
              <FormRow
                label={t.pages.index.Subject}
                isRequired
                isInvalid={!!formMethods.formState.errors.subject}
                errorMessage={formMethods.formState.errors.subject?.message}
              >
                <Input
                  type="text"
                  placeholder={t.pages.index['Good news for you']}
                  {...formMethods.register('subject')}
                />
                <FormHelperText mt="0.1rem">
                  {t.pages.index['Can embed variables with %variable%']}
                </FormHelperText>
              </FormRow>
              <FormRow
                label={t.pages.index['Body']}
                isRequired
                isInvalid={!!formMethods.formState.errors.body}
                errorMessage={formMethods.formState.errors.body?.message}
              >
                <Textarea
                  rows={10}
                  placeholder={
                    t.pages.index[
                      "Hi %name%,\n\nI'm excited to announce that..."
                    ]
                  }
                  {...formMethods.register('body')}
                />
                <FormHelperText mt="0.1rem">
                  {t.pages.index['Can embed variables with %variable%']}
                </FormHelperText>
              </FormRow>
              <FormRow
                label={t.pages.index.Recipients}
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
                <FormHelperText mt="0.1rem">
                  {
                    t.pages.index[
                      'Can enter multiple entries separated by line breaks.'
                    ]
                  }
                </FormHelperText>
              </FormRow>
              <ResponsiveRow
                left={
                  <FormLabel m={0} lineHeight="2.5rem">
                    {t.pages.index.Variables}
                  </FormLabel>
                }
                right={
                  <>
                    {variables.map((variable, i) => (
                      <Flex
                        mb="0.3rem"
                        gap="0.5rem"
                        p="0.5rem"
                        borderWidth="1px"
                        borderRadius="var(--chakra-radii-md)"
                        key={i}
                      >
                        <Flex wrap="wrap" gap="0.5rem" flexGrow={1}>
                          <Box flexGrow={1}>
                            <FormControl
                              isInvalid={
                                !!formMethods.formState.errors.variables?.[i]
                                  ?.name
                              }
                            >
                              <FormLabel>
                                {t.pages.index['Variable name']}
                              </FormLabel>
                              <InputGroup>
                                <InputLeftAddon>%</InputLeftAddon>
                                <Input
                                  type="text"
                                  placeholder="name"
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
                              <FormLabel>
                                {t.pages.index['Values per recipients']}
                              </FormLabel>
                              <Textarea
                                rows={5}
                                placeholder={t.pages.index['Alice\nBob']}
                                {...formMethods.register(
                                  `variables.${i}.values`,
                                )}
                              />
                              <FormHelperText mt="0.1rem">
                                {
                                  t.pages.index[
                                    'Enter the same number of recipients separated by line breaks.'
                                  ]
                                }
                              </FormHelperText>
                              <FormErrorMessage mt="0.1rem">
                                {
                                  formMethods.formState.errors.variables?.[i]
                                    ?.values?.message
                                }
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                        </Flex>
                        <IconButton
                          aria-label={t.pages.index.Remove}
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
                      aria-label={t.pages.index.Add}
                      variant="solid"
                      size="xl"
                      w="100%"
                      h="2.5rem"
                      icon={<Icon as={AiOutlinePlus} />}
                      onClick={() => onAppendVariable('', [])}
                    />
                  </>
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
                {t.pages.index.Preview}
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </NarrowBox>
    </AppTemplate>
  )
}

export default Index
