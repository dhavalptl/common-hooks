import { useEffect, useState } from 'react'

export type FETCH_STATUS = 'idle' | 'pending' | 'success' | 'error'

export const useFetch = <T, E = string>(url: string, options?: RequestInit) => {
  const [status, setStatus] = useState<FETCH_STATUS>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const fetchData = async () => {
      setStatus('pending')
      try {
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        })
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const data = (await response.json()) as T
        setData(data)
        setStatus('success')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!abortController.signal.aborted) {
          setError(e.message)
          setStatus('error')
        }
      }
    }
    fetchData()
    return () => {
      abortController.abort()
    }
  }, [url, options])

  return {
    status,
    data,
    error,
  }
}
