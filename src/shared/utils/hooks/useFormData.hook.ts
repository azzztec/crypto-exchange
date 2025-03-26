import { useCallback, useEffect, useState } from 'react'

export type FormData<T> = {
  [K in keyof T]: T[K]
}

export type FormErrors<T> = {
  [K in keyof T]?: string
}

type UseFormDataOptions<T> = {
  initialValues: FormData<T>
  onSubmit: (values: FormData<T>) => void
  validate?: (values: FormData<T>) => FormErrors<T>
}

export function useFormData<T>({
  initialValues,
  onSubmit,
  validate,
}: UseFormDataOptions<T>) {
  const [formData, setFormData] = useState<FormData<T>>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})

  const _validate = (formData: FormData<T>) => {
    if (validate) {
      const validationErrors = validate(formData)
      setErrors(validationErrors)
      if (Object.keys(validationErrors).length > 0) {
        return false
      }
    }
  }

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target
      _validate({ ...formData, [name]: value })
      // if (_validate({ ...formData, [name]: value })) {
      setFormData((prevValues) => ({
        ...prevValues,
        [name]: value,
      }))
      // }
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (_validate(formData)) {
        await onSubmit(formData)
        return false
      }
    },
    [formData, validate, onSubmit]
  )

  useEffect(() => {
    setErrors({})
  }, [formData])

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  }
}
