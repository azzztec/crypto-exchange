import { CoinDto } from './coin.dto'
import { ICoin } from './types'

export const dtoToCoin = (dto: CoinDto): ICoin => {
  return {
    id: dto.id,
    name: dto.name,
    symbol: dto.symbol,
  }
}

export const dtoListToCoinList = (dto: CoinDto[]): ICoin[] => {
  return dto.map(dtoToCoin)
}
