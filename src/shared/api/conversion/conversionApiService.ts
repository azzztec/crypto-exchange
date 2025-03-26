import apiInstance from '../apiInstance'
import BaseApiService from '../baseApi.service'
import { ConversionDto } from './conversion.dto'
import { dtoToConversion } from './transform'
import { IConversion } from './type'

class ConversionApiService extends BaseApiService {
  async fetchConversion({
    fromCoinId,
    toCoinId,
    fromAmount = 0,
    toAmount = 0,
  }: {
    fromCoinId: number
    toCoinId: number
    fromAmount?: number
    toAmount?: number
  }): Promise<IConversion> {
    try {
      let url = `${this._url}?from=${fromCoinId}&to=${toCoinId}`

      if (fromAmount) url += `&fromAmount=${fromAmount}`
      else url += `&toAmount=${toAmount}`

      const response = await apiInstance.get(url)
      const data = (await response.json()) as ConversionDto

      return dtoToConversion(data)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export const conversionApiService = new ConversionApiService('/conversion')
