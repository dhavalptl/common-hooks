import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    if (!delay && delay !== 0) {
      return
    }
    const id = setInterval(() => savedCallback.current(), delay)
    return () => {
        id && clearInterval(id);
    }
  }, [delay])
}