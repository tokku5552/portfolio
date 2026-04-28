import { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

export interface GridOverlayProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
}

export function GridOverlay({
  visible = false,
  className,
  ...rest
}: GridOverlayProps) {
  return (
    <div
      aria-hidden="true"
      data-visible={visible ? 'true' : 'false'}
      className={cn('tb-grid-overlay', className)}
      {...rest}
    />
  );
}

export default GridOverlay;
