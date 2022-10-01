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
  Tag,
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
          `${result.to}\t${result.success ? '成功' : '失敗'}\t${
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
        <ModalBody px={0} pb="1rem">
          <TableContainer w="calc(100vw - 2rem)" mb="1rem">
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
                          成功
                        </Box>
                      ) : (
                        <Box color="red.500">
                          <Icon
                            as={AiFillCloseCircle}
                            mb="-0.15em"
                            mr="0.2em"
                          />
                          失敗
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
              クリップボードにコピー
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
              <Tag color="green.500" size="sm" mr="0.1em">
                成功
              </Tag>
              はあくまでSMTPサーバーにAcceptされたという意味であり、宛先にメールが到達したとは限りませんのでご注意ください。実際にメールが到達したかどうかはSMTPサーバーのログなどでご確認ください。
            </Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
