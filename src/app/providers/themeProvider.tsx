import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
