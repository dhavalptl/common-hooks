import { useState, useEffect, MutableRefObject, useCallback } from 'react'

const useContainerSize = (containerRef: MutableRefObject<HTMLElement | undefined>) => {
  const getDimensions = useCallback(() => ({
    width: containerRef?.current?.offsetWidth,
    height: containerRef?.current?.offsetHeight
  }), [containerRef])

  const [dimensions, setDimensions] = useState(() => getDimensions())

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }

    const dimensionsTimeout = setTimeout(() => {
      if(containerRef.current) {
        setDimensions(getDimensions())
      }
    }, 100)

    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(dimensionsTimeout)
      window.removeEventListener("resize", handleResize)
    }
  }, [containerRef, getDimensions])

  return dimensions
}

export default useContainerSize