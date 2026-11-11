import { useCallback, useEffect, useRef, useState } from 'react'

export interface DataState<T> {
  data: T | null
  loading: boolean
  error: string | null
  loaded: boolean
}

export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
): DataState<T> & { execute: () => Promise<void>; retry: () => Promise<void> } {
  const [state, setState] = useState<DataState<T>>({ data: null, loading: true, error: null, loaded: false })
  const abortRef = useRef<AbortController | null>(null)

  const execute = useCallback(async () => {
    const controller = new AbortController()
    abortRef.current = controller

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await fetchFn()
      if (controller.signal.aborted) return
      setState({ data, loading: false, error: null, loaded: true })
    } catch (error) {
      if (controller.signal.aborted) return
      setState({
        data: null,
        loading: false,
        loaded: true,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }, [fetchFn])

  useEffect(() => {
    // Fetch-on-mount is required: the effect owns the request lifecycle and
    // aborts stale requests on unmount, so there is no cascade risk.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    execute()
    return () => {
      abortRef.current?.abort()
    }
  }, [execute])

  const retry = execute

  return { ...state, execute, retry }
}