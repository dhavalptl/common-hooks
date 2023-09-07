import { cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SampleSeparator = ({ id = 'drag-bar', dir, disabled, ...props }: any) => {
  return (
    <hr
      id={id}
      data-testid={id}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'sample-drag-bar',
        dir === 'horizontal' && 'sample-drag-bar--horizontal',
        disabled && 'disabled',
      )}
      {...props}
    />
  );
};

export default SampleSeparator;