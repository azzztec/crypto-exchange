import { ConversionDto } from './conversion.dto'
import { IConversion } from './type'

export const dtoToConversion = (dto: ConversionDto): IConversion => {
  return {
    rate: dto.rate,
    estimatedAmount: dto.estimatedAmount,
  }
}
