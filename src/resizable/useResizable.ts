import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { Resizable, SeparatorProps, UseResizableProps } from './types';

const useResizable = ({
  axis,
  disabled = false,
  initial = 0,
  min = 0,
  max = Infinity,
  onResizeStart,
  onResizeEnd,
  containerRef,
}: UseResizableProps): Resizable => {
  const initialPosition = Math.min(Math.max(initial, min), max);
  const isResizing = useRef(false);
  const [position, setPosition] = useState(initialPosition);
  const positionRef = useRef(initialPosition);
  const [endPosition, setEndPosition] = useState(initialPosition);

  const ariaProps = useMemo<SeparatorProps>(
    () => ({
      role: 'separator',
      'aria-valuenow': position,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-orientation': axis === 'x' ? 'vertical' : 'horizontal',
      'aria-disabled': disabled,
    }),
    [axis, disabled, max, min, position],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isResizing.current) return;
      if (disabled) return;
      e.stopPropagation();
      e.preventDefault();

      const currentPosition = (() => {
        if (axis === 'x') {
          if (containerRef?.current) {
            const containerNode = containerRef.current;
            const { left } = containerNode.getBoundingClientRect();
            return e.clientX - left;
          }
          return e.clientX;
        }
        if (containerRef?.current) {
          const containerNode = containerRef.current;
          const { top } = containerNode.getBoundingClientRect();
          return e.clientY - top;
        }
        return e.clientY;
      })();

      if (min < currentPosition && currentPosition < max) {
        setPosition(currentPosition);
        positionRef.current = currentPosition;
      }
    },
    [axis, disabled, max, min, containerRef],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (disabled) return;
      e.stopPropagation();
      isResizing.current = false;
      setEndPosition(positionRef.current);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      if (onResizeEnd) onResizeEnd();
    },
    [disabled, handlePointerMove, onResizeEnd],
  );

  const handlePointerDown = useCallback<React.PointerEventHandler>(
    (e) => {
      if (disabled) return;
      e.stopPropagation();
      isResizing.current = true;
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      if (onResizeStart) onResizeStart();
    },
    [disabled, handlePointerMove, handlePointerUp, onResizeStart],
  );

  return {
    position,
    endPosition,
    separatorProps: {
      ...ariaProps,
      onPointerDown: handlePointerDown
    }
  };
};

export default useResizable;