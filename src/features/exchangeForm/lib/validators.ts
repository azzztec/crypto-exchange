import { FormData, FormErrors } from '@/shared/utils/hooks/useFormData.hook'
import { IExchangeFormData } from '../model/types'

export function exchangeFormValidator(
  values: FormData<IExchangeFormData>
): FormErrors<IExchangeFormData> {
  const errors: FormErrors<IExchangeFormData> = {}

  const fromValue = values.fromAmount
  const toValue = values.toAmount

  if (!fromValue) {
    errors.fromAmount = 'Обязательное поле'
  } else if (Number.isNaN(parseFloat(fromValue))) {
    errors.fromAmount = 'Введи число'
  }

  if (!toValue) {
    errors.toAmount = 'Обязательное поле'
  } else if (Number.isNaN(parseFloat(toValue))) {
    errors.toAmount = 'Введи число'
  }

  return errors
}
