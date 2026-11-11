import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

interface DataRefreshContextValue {
  register: (key: string, fn: () => void | Promise<void>) => () => void
  refreshAll: () => Promise<void>
  isRefreshing: boolean
}

const DataRefreshContext = createContext<DataRefreshContextValue | null>(null)

/**
 * Lightweight refresh dispatcher. Pages register their own retry functions so a
 * single "Refresh data" control in the shell can re-fetch every live dataset
 * without a global store.
 */
export function DataProvider({ children }: { children: ReactNode }) {
  const registry = useRef<Map<string, () => void | Promise<void>>>(new Map())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const register = useCallback(
    (key: string, fn: () => void | Promise<void>) => {
      registry.current.set(key, fn)
      return () => {
        registry.current.delete(key)
      }
    },
    [],
  )

  const refreshAll = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await Promise.allSettled([...registry.current.values()].map((fn) => fn()))
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing])

  return (
    <DataRefreshContext.Provider value={{ register, refreshAll, isRefreshing }}>
      {children}
    </DataRefreshContext.Provider>
  )
}

export function useRegisterRefresh(key: string, fn: () => void | Promise<void>) {
  const ctx = useContext(DataRefreshContext)
  if (!ctx) {
    throw new Error('useRegisterRefresh must be used inside a DataProvider')
  }
  useEffect(() => ctx.register(key, fn), [ctx, key, fn])
}

export function useRefreshAll() {
  const ctx = useContext(DataRefreshContext)
  if (!ctx) {
    throw new Error('useRefreshAll must be used inside a DataProvider')
  }
  return ctx
}