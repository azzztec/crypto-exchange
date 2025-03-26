import { useFormData } from '@/shared/utils/hooks/useFormData.hook'
import {
  Box,
  Button,
  Field,
  HStack,
  IconButton,
  Separator,
  VStack,
  Text,
} from '@chakra-ui/react'
import { MdOutlineSwapVerticalCircle } from 'react-icons/md'
import { ConversionFlowType, IExchangeFormData } from '../model/types'
import { exchangeFormValidator } from '../lib/validators'
import { ICoin } from '@/shared/api'
import useDebounce from '@/shared/utils/hooks/useDebounce.hook'
import { CoinAmountInput } from './CoinAmountInput'
import { useEffect, useState } from 'react'
import { CoinsSelector } from './CoinsSelector'
import useFetchData from '@/shared/utils/hooks/useFetchData.hook'
import { IConversion } from '@/shared/api/conversion/type'
import { conversionApiService } from '@/shared/api/conversion/conversionApiService'
import { toFixed } from '@/shared/utils/numberFormatters'

export const ExchangeForm = () => {
  const [fromCoin, setFromCoin] = useState<ICoin | null>(null)
  const [toCoin, setToCoin] = useState<ICoin | null>(null)
  const [conversionFlow, setConversionFlow] =
    useState<ConversionFlowType>('NONE')
  const { formData, errors, handleChange, handleSubmit } =
    useFormData<IExchangeFormData>({
      initialValues: {
        fromAmount: '0',
        toAmount: '0',
      },
      onSubmit: async () => Promise.resolve('sumbitted'),
      validate: exchangeFormValidator,
    })
  const debouncedFormData = useDebounce(formData, 300)
  const { fromAmount, toAmount } = debouncedFormData
  const {
    data: conversionData,
    isLoading: isConversionLoading,
    refetch,
  } = useFetchData<IConversion>(
    async () => {
      if (fromCoin && toCoin) {
        if (conversionFlow === 'SEND') {
          const res = await conversionApiService.fetchConversion({
            fromCoinId: fromCoin.id,
            toCoinId: toCoin.id,
            fromAmount: parseFloat(fromAmount),
          })
          return { data: res }
        } else if (conversionFlow === 'GET') {
          const res = await conversionApiService.fetchConversion({
            fromCoinId: fromCoin.id,
            toCoinId: toCoin.id,
            toAmount: parseFloat(toAmount),
          })
          return { data: res }
        }
      }

      return { data: { rate: 0, estimatedAmount: 0 } }
    },
    { fetchOnLoad: true, initialData: { rate: 0, estimatedAmount: 0 } }
  )

  const handleSwapCoins = () => {
    setFromCoin(toCoin)
    setToCoin(fromCoin)
  }

  const displayRate = () => {
    if (fromCoin && conversionData?.rate && toCoin) {
      return `Rate: 1 ${fromCoin?.symbol} = ${isConversionLoading ? '...' : toFixed(conversionData!.rate)} ${toCoin?.symbol}`
    }
    return ''
  }

  useEffect(() => {
    refetch()
  }, [fromCoin, toCoin, fromAmount, toAmount])

  return (
    <Box borderRadius="lg">
      <form>
        <Box backgroundColor="white" shadow="sm" borderRadius="lg" p={4}>
          <VStack>
            <Field.Root invalid={!!errors.fromAmount}>
              <Field.Label>
                <Text color="gray">From</Text> <Field.RequiredIndicator />
              </Field.Label>
              <CoinAmountInput
                name="fromAmount"
                value={
                  conversionFlow === 'SEND'
                    ? formData.fromAmount
                    : toFixed(conversionData?.estimatedAmount!)
                }
                isLoading={
                  !!fromCoin &&
                  !!toCoin &&
                  conversionFlow === 'GET' &&
                  isConversionLoading
                }
                onChange={(e) => {
                  handleChange(e)
                  setConversionFlow('SEND')
                }}
                coinsSelectorElement={() => (
                  <CoinsSelector
                    coin={fromCoin}
                    onSelect={(coin: ICoin) => setFromCoin(coin)}
                  />
                )}
              />
              <Field.ErrorText>{errors.fromAmount}</Field.ErrorText>
            </Field.Root>

            <HStack width="100%" mt={4}>
              <Separator flex="1" />
              <IconButton
                size="md"
                variant="outline"
                borderRadius="100%"
                onClick={handleSwapCoins}
              >
                <MdOutlineSwapVerticalCircle />
              </IconButton>
              <Separator flex="1" />
            </HStack>

            <Field.Root invalid={!!errors.toAmount}>
              <Field.Label>
                <Text color="gray">To</Text> <Field.RequiredIndicator />
              </Field.Label>
              <CoinAmountInput
                name="toAmount"
                value={
                  conversionFlow === 'GET'
                    ? formData.toAmount
                    : toFixed(conversionData?.estimatedAmount!)
                }
                isLoading={
                  !!fromCoin &&
                  !!toCoin &&
                  conversionFlow === 'SEND' &&
                  isConversionLoading
                }
                onChange={(e) => {
                  handleChange(e)
                  setConversionFlow('GET')
                }}
                coinsSelectorElement={() => (
                  <CoinsSelector
                    coin={toCoin}
                    onSelect={(coin: ICoin) => setToCoin(coin)}
                  />
                )}
              />
              <Field.ErrorText>{errors.toAmount}</Field.ErrorText>
            </Field.Root>
            <VStack align="left" color="gray.600" width="100%" mt={2}>
              <Text textAlign="left" fontSize={12}>
                {displayRate()}
              </Text>
            </VStack>
          </VStack>
        </Box>

        <Box
          shadow="sm"
          borderRadius="lg"
          padding={2}
          mt={4}
          backgroundColor="white"
        >
          <Button
            width="100%"
            borderRadius="lg"
            fontWeight={700}
            onClick={(e) => {
              handleSubmit(e)
            }}
          >
            Exchange
          </Button>
        </Box>
      </form>
    </Box>
  )
}
