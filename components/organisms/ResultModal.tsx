import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import {AiFillCheckCircle, AiFillCloseCircle} from 'react-icons/ai'
import {Result} from '@/pages'

type Props = {
  isOpen: boolean
  onClose: () => void
  results: Result[]
}

export const ResultModal: React.FC<Props> = ({isOpen, onClose, results}) => {
  const toast = useToast()

  const onCopy = async () => {
    const text = results
      .map(
        (result) =>
          `${result.to}\t${result.success ? 'Accepted' : 'Failed'}\t${
            result.error ?? ''
          }`,
      )
      .join('\n')
    await navigator.clipboard.writeText(text)
    toast({
      title: 'クリップボードにコピーしました。',
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
        <ModalHeader>送信結果</ModalHeader>
        <ModalCloseButton />
        <ModalBody px="1rem" pb="1.5rem">
          <TableContainer w="calc(100vw - 4rem)" mb="2rem">
            <Table>
              <Thead>
                <Tr>
                  <Th>宛先</Th>
                  <Th>結果</Th>
                  <Th>エラー詳細</Th>
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
                          Accepted
                        </Box>
                      ) : (
                        <Box color="red.500">
                          <Icon
                            as={AiFillCloseCircle}
                            mb="-0.15em"
                            mr="0.2em"
                          />
                          Failed
                        </Box>
                      )}
                    </Td>
                    <Td>{result.error}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex>
            <Button variant="primaryOutline" ml="auto" onClick={onCopy}>
              クリップボードにコピー
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
