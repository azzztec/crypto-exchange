export interface IExchangeFormData {
  fromAmount: string
  toAmount: string
}

export type ConversionFlowType = 'SEND' | 'GET' | 'NONE'
