import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillInfoCircle,
} from 'react-icons/ai'
import {Result} from '@/lib/domain'
import {useLocale} from '@/lib/i18n'

type Props = {
  isOpen: boolean
  onClose: () => void
  results: Result[]
}

export const ResultModal: React.FC<Props> = ({isOpen, onClose, results}) => {
  const {t} = useLocale()
  const toast = useToast()

  const onCopy = async () => {
    const text = results
      .map(
        (result) =>
          `${result.to}\t${
            result.success
              ? t.components.organisms.ResultModal.Success
              : t.components.organisms.ResultModal.Failed
          }\t${result.error ?? ''}`,
      )
      .join('\n')
    await navigator.clipboard.writeText(text)
    toast({
      title: t.components.organisms.ResultModal['Copied!'],
      position: 'top',
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent mx="1rem">
        <ModalHeader>{t.components.organisms.ResultModal.Result}</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={0} pb="1rem">
          <TableContainer w="calc(100vw - 2rem)" mb="1rem">
            <Table>
              <Thead>
                <Tr>
                  <Th>{t.components.organisms.ResultModal.Recipient}</Th>
                  <Th>{t.components.organisms.ResultModal.Status}</Th>
                  <Th>{t.components.organisms.ResultModal['Error details']}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {results.map((result, i) => (
                  <Tr key={i}>
                    <Td>{result.to}</Td>
                    <Td>
                      {result.success ? (
                        <Box color="green.500">
                          <Icon
                            as={AiFillCheckCircle}
                            mb="-0.15em"
                            mr="0.2em"
                          />
                          {t.components.organisms.ResultModal.Success}
                        </Box>
                      ) : (
                        <Box color="red.500">
                          <Icon
                            as={AiFillCloseCircle}
                            mb="-0.15em"
                            mr="0.2em"
                          />
                          {t.components.organisms.ResultModal.Failed}
                        </Box>
                      )}
                    </Td>
                    <Td>{result.error}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex px="1rem">
            <Button variant="primaryOutline" ml="auto" onClick={onCopy}>
              {t.components.organisms.ResultModal['Copy to clipboard']}
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter bg="gray.50" borderBottomRadius="var(--chakra-radii-md)">
          <Flex align="center">
            <Icon
              as={AiFillInfoCircle}
              fontSize="1.5rem"
              color="orange.300"
              mr="1rem"
            />
            <Text fontSize="0.8rem" color="gray.500">
              {
                t.components.organisms.ResultModal[
                  'Please note that "Success" only means that the email was accepted by the SMTP server, and does not necessarily mean that the email has delivered to the recipient. Please check the SMTP server log and so on to see if the email actually delivered.'
                ]
              }
            </Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
