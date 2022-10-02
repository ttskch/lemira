import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from '@chakra-ui/react'
import {ChangeEvent, useState} from 'react'
import {AiOutlineSend} from 'react-icons/ai'
import {FormRow} from '@/components/molecules/FormRow'
import {applyVariables, Envelope} from '@/lib/domain'
import {useLocale} from '@/lib/i18n'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  envelope: Envelope | undefined
}

export const PreviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSend,
  envelope,
}) => {
  const {t} = useLocale()
  const [recipientIndex, setRecipientIndex] = useState<number>(0)

  if (!envelope) {
    return <></>
  }

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setRecipientIndex(Number(event.target.value))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent mx="1rem">
        <ModalHeader>{t.components.organisms.PreviewModal.Preview}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="1.5rem">
          <Box mb="2rem">
            <FormRow label={t.components.organisms.PreviewModal.To}>
              <Select onChange={onSelect} lineHeight="2.5rem">
                {envelope.recipients.map((recipient, i) => (
                  <option value={i} key={i}>
                    {recipient}
                  </option>
                ))}
              </Select>
            </FormRow>
            <FormRow label="From">
              <Input
                variant="filled"
                value={
                  envelope.fromName
                    ? `${envelope.fromName} <${envelope.from}>`
                    : envelope.from
                }
                readOnly
              />
            </FormRow>
            <FormRow label="ReplyTo">
              <Input variant="filled" value={envelope.replyTo} readOnly />
            </FormRow>
            <FormRow label={t.components.organisms.PreviewModal.Subject}>
              <Input
                variant="filled"
                value={applyVariables(
                  envelope.subject,
                  envelope.variables,
                  recipientIndex,
                )}
                readOnly
              />
            </FormRow>
            <FormRow label={t.components.organisms.PreviewModal.Body}>
              <Textarea
                variant="filled"
                value={applyVariables(
                  envelope.body,
                  envelope.variables,
                  recipientIndex,
                )}
                readOnly
                rows={(envelope.body.match(/\n/g)?.length ?? 0) + 1}
              />
            </FormRow>
          </Box>
          <Flex>
            <Button
              ml="auto"
              onClick={() => {
                onClose()
                onSend()
              }}
            >
              <Icon as={AiOutlineSend} mr="0.2rem" />
              {t.components.organisms.PreviewModal['Send ? emails'](
                envelope.recipients.length,
              )}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
