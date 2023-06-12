import { useEffect, useState } from 'react'

export const useFetcher = <T, E = string>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const fetchData = async () => {
      setData(null)
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
      } catch (e: any) {
        if (!abortController.signal.aborted) {
          setError(e.message)
        }
      }
    }
    void fetchData()
    return () => {
      abortController.abort()
    }
  }, [url])

  return {
    data,
    error,
  }
}
