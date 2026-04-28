import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/libs/cn';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonSize = 'md';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const buttonBase = cn(
  'relative inline-flex items-center gap-3 rounded-[4px]',
  'font-brand-sans text-[15px] tracking-[-0.005em] no-underline cursor-pointer',
  'transition-transform duration-200 ease-out',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orb-violet focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg',
  'disabled:cursor-not-allowed disabled:opacity-60'
);

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'tb-btn-primary',
    'bg-brand-fg text-brand-bg font-bold',
    'overflow-hidden border-0',
    'hover:-translate-y-px hover:[&_*]:text-brand-fg'
  ),
  ghost: cn(
    'bg-transparent text-brand-fg font-medium',
    'border border-brand-border-strong',
    'font-brand-mono text-[13px] tracking-[0.02em]',
    'hover:bg-white/[0.04] hover:border-white/30'
  ),
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  md: 'px-7 py-[18px]',
};

/**
 * Compose Button-equivalent classes for non-button elements (anchors / links).
 * Used when a CTA is actually a link and we want to avoid nesting <button> inside <a>.
 */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string
): string {
  return cn(
    buttonBase,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    extra
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      type = 'button',
      className,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses(variant, size, className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
