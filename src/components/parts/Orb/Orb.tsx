import { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

export type OrbPosition = 'tr' | 'bl' | 'center';

export interface OrbProps extends HTMLAttributes<HTMLDivElement> {
  position?: OrbPosition;
}

export function Orb({ position = 'tr', className, ...rest }: OrbProps) {
  return (
    <div
      aria-hidden="true"
      data-pos={position}
      className={cn('tb-orb-wrap', className)}
      {...rest}
    >
      <div className="tb-orb" />
    </div>
  );
}

export default Orb;
