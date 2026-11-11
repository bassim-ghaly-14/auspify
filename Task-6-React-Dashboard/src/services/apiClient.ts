export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface RequestOptions {
  timeoutMs?: number
  retries?: number
  signal?: AbortSignal
}

const API_BASE = 'https://dummyjson.com'

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function combineSignals(signals: Array<AbortSignal | undefined>): AbortSignal | undefined {
  const active = signals.filter((s): s is AbortSignal => Boolean(s))
  if (active.length === 0) return undefined
  if (active.length === 1) return active[0]!
  const controller = new AbortController()
  const abort = () => controller.abort()
  for (const signal of active) {
    if (signal.aborted) {
      abort()
      break
    }
    signal.addEventListener('abort', abort, { once: true })
  }
  return controller.signal
}

/**
 * Fetch and parse JSON with timeout, retries (network/server errors only),
 * and AbortController support. Stale requests are aborted by callers through
 * their own signal so they never overwrite newer results.
 */
export async function fetchJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 15000, retries = 2, signal: externalSignal, ...init } = options
  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const signal = combineSignals([externalSignal, controller.signal]) as AbortSignal
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(`${API_BASE}${path}`, { signal, ...init })
      clearTimeout(timer)

      if (!response.ok) {
        const error = new ApiError(response.status, `API request failed with status ${response.status}`)
        if (error.status < 500 && error.status !== 429) throw error
        throw error
      }

      return (await response.json()) as T
    } catch (error) {
      clearTimeout(timer)
      lastError = error

      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }
      if (error instanceof ApiError && error.status < 500 && error.status !== 429) {
        throw error
      }
      if (attempt === retries) break
      await sleep(400 * (attempt + 1))
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Request failed')
}