import { useRootStore } from '@/app/providers/rootStoreProvider'
import { ICoin } from '@/shared/api'
import {
  HStack,
  Input,
  InputGroup,
  Menu,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useMemo, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { LuSearch } from 'react-icons/lu'
import { coinsSearchFilter } from '../lib/filters'

interface IProps {
  onSelect: (coin: ICoin) => void
  coin: ICoin | null
}

export const CoinsSelector: FC<IProps> = observer(({ onSelect, coin }) => {
  const [inputSearch, setInputSearch] = useState<string>('')
  const { coinsStore } = useRootStore()
  const _coins = useMemo(
    () => Array.from(coinsStore.coins.values()),
    [coinsStore.isLoading]
  )

  const coins = coinsSearchFilter(_coins, inputSearch)

  const handleSelect = (id: string) => {
    const coin = coinsStore.coinById(parseInt(id))
    if (coin) onSelect(coin)
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setInputSearch(e.target.value)

  return (
    <Menu.Root
      size="md"
      unmountOnExit={true}
      onSelect={(details) => handleSelect(details.value)}
    >
      <Menu.Trigger asChild>
        <HStack
          pointerEvents="auto"
          px={2}
          py={0.5}
          fontWeight={700}
          shadow="xs"
          borderRadius={10}
          _hover={{ bg: 'gray.100', cursor: 'pointer' }}
        >
          {coin ? <Text>{coin.symbol}</Text> : <Text color="red">Choose</Text>}
          <IoIosArrowDown />
        </HStack>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {coinsStore.isLoading ? (
              <Spinner />
            ) : (
              <>
                <InputGroup flex="1" mb={4} startElement={<LuSearch />}>
                  <Input
                    placeholder="Search coin"
                    size="sm"
                    onChange={handleInputChange}
                  />
                </InputGroup>
                {coins.map((_coin) => (
                  <Menu.Item
                    value={String(_coin.id)}
                    key={_coin.id}
                    width="100%"
                  >
                    <VStack
                      align="left"
                      gap={0}
                      width="100%"
                      p={2}
                      boxShadow="xs"
                      backgroundColor={
                        coin?.id === _coin.id ? 'gray.100' : 'auto'
                      }
                    >
                      <Text fontWeight={600}>{_coin.symbol}</Text>
                      <Text>{_coin.name}</Text>
                    </VStack>
                  </Menu.Item>
                ))}
              </>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
})
