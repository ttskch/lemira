import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
} from '@chakra-ui/react'
import {useLocale} from '@/lib/i18n'

type Props = {
  isOpen: boolean
  onClose: () => void
  total: number
  progress: number
}

export const ProgressModal: React.FC<Props> = ({
  isOpen,
  onClose,
  total,
  progress,
}) => {
  const {t} = useLocale()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      blockScrollOnMount={false} // @see https://github.com/chakra-ui/chakra-ui/issues/6213#issuecomment-1216003840
    >
      <ModalOverlay />
      <ModalContent mx="1rem">
        <ModalHeader>
          {t.components.organisms.ProgressModal.Sending}{' '}
          <Spinner h="1rem" w="1rem" speed="1s" />
        </ModalHeader>
        <ModalBody pb="1.5rem">
          <Progress value={(progress / total) * 100} />
          <Center mt="0.5rem">
            {progress} / {total}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
