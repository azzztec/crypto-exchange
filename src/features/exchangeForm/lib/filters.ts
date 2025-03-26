import { ICoin } from '@/shared/api'

export const coinsSearchFilter = (coins: ICoin[], pattern: string): ICoin[] => {
  if (pattern) {
    return coins.filter((coin) => {
      return (
        coin.symbol.toLowerCase().includes(pattern) ||
        coin.name.toLowerCase().includes(pattern)
      )
    })
  }

  return coins
}
