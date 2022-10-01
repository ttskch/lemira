import {Box, FormControl, FormErrorMessage, FormLabel} from '@chakra-ui/react'
import {ResponsiveRow} from '@/components/molecules/ResponsiveRow'

type Props = {
  children: React.ReactNode
  label: string
  isRequired?: boolean
  isInvalid?: boolean
  errorMessage?: string
  mb?: string | 0
  labelWidth?: string
} & React.ComponentProps<typeof Box>

export const FormRow: React.FC<Props> = ({
  children,
  label,
  isRequired,
  isInvalid,
  errorMessage,
  mb,
  labelWidth,
}) => {
  return (
    <FormControl
      isRequired={!!isRequired}
      isInvalid={!!isInvalid}
      mb={mb ?? '0.5rem'}
    >
      <ResponsiveRow
        left={
          <FormLabel m={0} lineHeight={{base: '2rem', sm: '2.5rem'}}>
            {label}
          </FormLabel>
        }
        right={
          <>
            {children}
            <FormErrorMessage mt="0.1rem">{errorMessage}</FormErrorMessage>
          </>
        }
        leftWidth={labelWidth}
      />
    </FormControl>
  )
}
