import { ExchangeForm } from '@/features/exchangeForm'
import { Box, Container, VStack } from '@chakra-ui/react'

export const MainPage = () => {
  return (
    <Box backgroundColor="gray.100">
      <Container height="100vh">
        <VStack justify="center" height="100%">
          <ExchangeForm />
        </VStack>
      </Container>
    </Box>
  )
}
