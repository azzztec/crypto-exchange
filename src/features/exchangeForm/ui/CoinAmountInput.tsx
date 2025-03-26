import { Input, InputGroup, Spinner } from '@chakra-ui/react'
import { ChangeEvent, FC } from 'react'

interface IProps {
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  name: string
  coinsSelectorElement?: () => React.ReactNode
  value?: string | number
  isLoading?: boolean
}

export const CoinAmountInput: FC<IProps> = ({
  onChange,
  name,
  coinsSelectorElement,
  value,
  isLoading,
}) => {
  return (
    <InputGroup
      position="relative"
      startElement={coinsSelectorElement && coinsSelectorElement()}
    >
      <>
        {isLoading && <Spinner position="absolute" right="13px" />}
        <Input
          ps="120px"
          name={name}
          borderRadius="lg"
          textAlign="right"
          onChange={onChange}
          value={isLoading ? '' : value}
        />
      </>
    </InputGroup>
  )
}
