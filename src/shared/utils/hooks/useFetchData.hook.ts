import { useCallback, useEffect, useRef, useState } from 'react'

type FetcherResponse<T> = {
  data: T
}

interface FetcherOptions<T> {
  initialData?: T
  fetchOnLoad?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

interface FetcherState<T> {
  data: T | undefined
  error: Error | null
  isLoading: boolean
}

export default function useFetchData<T>(
  callback: (signal?: AbortSignal) => Promise<FetcherResponse<T>>,
  options: FetcherOptions<T> = {}
) {
  const {
    fetchOnLoad = false,
    onSuccess,
    onError,
    enabled = true,
    initialData,
  } = options

  const abortControllerRef = useRef<AbortController>(null)
  const isMountedRef = useRef(true)

  const [state, setState] = useState<FetcherState<T>>({
    data: initialData,
    error: null,
    isLoading: false,
  })

  const fetcher = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) return

      setState((prev) => ({ ...prev, isLoading: true }))
      try {
        const response = await callback(signal)
        setState({
          data: response.data,
          error: null,
          isLoading: false,
        })
        onSuccess?.(response.data)
      } catch (error: any) {
        if (error.name === 'AbortError') return
        if (!isMountedRef.current) return

        const errorObject =
          error instanceof Error
            ? error
            : new Error(error?.message || 'Unknown error')

        if ('status' in error) {
          ;(errorObject as any).status = error.status
        }

        setState((prev) => ({
          ...prev,
          error: errorObject,
          isLoading: false,
        }))

        onError?.(errorObject)
      }
    },
    [callback, enabled, onSuccess, onError]
  )

  useEffect(() => {
    if (
      fetchOnLoad &&
      enabled &&
      !state.data &&
      !state.error &&
      !state.isLoading
    ) {
      fetcher()
    }
  }, [fetchOnLoad, enabled, state.data, state.error, state.isLoading, fetcher])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    return fetcher(abortControllerRef.current.signal)
  }, [fetcher])

  return {
    ...state,
    refetch,
  }
}
