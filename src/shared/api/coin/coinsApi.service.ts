import apiInstance from '../apiInstance'
import BaseApiService from '../baseApi.service'
import { CoinDto } from './coin.dto'
import { dtoListToCoinList } from './transform'
import { ICoin } from './types'

class CoinsApiService extends BaseApiService {
  async fetchCoins(): Promise<ICoin[]> {
    try {
      const response = await apiInstance.get(this._url)
      const data = (await response.json()) as CoinDto[]
      return dtoListToCoinList(data)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export const coinsApiService = new CoinsApiService('/coins')
