import { useCallback, useEffect, useState } from 'react'
export type STATUS = 'idle' | 'pending' | 'success' | 'error'
export const useAsync = <T, E = string>(
  asyncFn: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<STATUS>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)
  const execute = useCallback(() => {
    setStatus('pending')
    setValue(null)
    setError(null)
    return asyncFn()
      .then((response) => {
        setValue(response)
        setStatus('success')
      })
      .catch((error) => {
        setError(error)
        setStatus('error')
      })
  }, [asyncFn])
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])
  return { execute, status, value, error }
}
