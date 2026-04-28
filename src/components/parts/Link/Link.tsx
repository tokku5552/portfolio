import NextLink from 'next/link';
import { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/libs/cn';

export interface LinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  href: string;
  external?: boolean;
  children?: ReactNode;
}

const base = cn(
  'inline-flex items-center gap-2',
  'text-brand-fg no-underline',
  'transition-colors duration-200 ease-out',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orb-violet focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg'
);

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, external, className, children, ...rest },
  ref
) {
  const merged = cn(base, className);
  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={merged}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <NextLink ref={ref} href={href} className={merged} {...rest}>
      {children}
    </NextLink>
  );
});

export default Link;
