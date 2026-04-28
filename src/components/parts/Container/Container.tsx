import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libs/cn';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

export function Container({
  as: Tag = 'div',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full max-w-shell px-6 md:px-12', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Container;
