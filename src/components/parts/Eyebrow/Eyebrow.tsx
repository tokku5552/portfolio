import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libs/cn';

export interface EyebrowProps extends HTMLAttributes<HTMLDivElement> {
  withPulse?: boolean;
  children?: ReactNode;
}

export function Eyebrow({
  withPulse,
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5',
        'font-brand-mono text-[12px] tracking-[0.12em] uppercase text-brand-muted',
        className
      )}
      {...rest}
    >
      {withPulse ? (
        <span className="tb-eyebrow-pulse" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
    </div>
  );
}

export default Eyebrow;
