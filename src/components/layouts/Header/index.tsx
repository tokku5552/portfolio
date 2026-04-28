import { useState } from 'react';
import Button from '../../parts/Button';
import Container from '../../parts/Container';
import Link from '../../parts/Link';
import { contactGoogleFormUrl } from '../../../config/constants';
import { menus } from '../../../features/home/menus';
import { cn } from '../../../libs/cn';

function Mark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-brand-mono text-[13px] tracking-[0.02em]"
    >
      <span
        aria-hidden="true"
        className="block h-2.5 w-2.5 rotate-45 bg-gradient-to-br from-brand-orb-indigo via-brand-orb-violet to-brand-orb-pink"
      />
      <span className="font-brand-sans text-[15px] font-black tracking-[-0.01em] text-brand-fg">
        tok
      </span>
      <span className="ml-2 text-brand-muted">/ shinnosuke tokuda</span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/60">
      <Container as="nav" className="flex items-center justify-between py-7">
        <Mark />

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="header-mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-[4px] md:hidden',
            'border border-brand-border-strong text-brand-fg',
            'transition-colors hover:bg-white/[0.04]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orb-violet focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg'
          )}
        >
          <span aria-hidden="true" className="font-brand-mono text-base">
            {open ? '×' : '≡'}
          </span>
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {menus.map((menu) => (
            <li key={menu.title}>
              <Link
                href={menu.href}
                external={menu.external}
                className="font-brand-mono text-[13px] tracking-[0.02em] text-brand-muted transition-colors hover:text-brand-fg"
              >
                {menu.title}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={contactGoogleFormUrl}
          external
          className="hidden md:inline-flex font-brand-mono text-[12px] tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3.5 py-2 transition-colors hover:bg-white/[0.04] hover:border-white/30"
        >
          Get in touch ↗
        </Link>
      </Container>

      {open ? (
        <div
          id="header-mobile-menu"
          className="md:hidden border-t border-brand-border bg-brand-bg"
        >
          <Container as="ul" className="flex flex-col gap-4 py-6">
            {menus.map((menu) => (
              <li key={menu.title}>
                <Link
                  href={menu.href}
                  external={menu.external}
                  onClick={() => setOpen(false)}
                  className="font-brand-mono text-[14px] tracking-[0.02em] text-brand-fg"
                >
                  {menu.title}
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                onClick={() => {
                  window.open(
                    contactGoogleFormUrl,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  setOpen(false);
                }}
                className="w-full justify-center"
              >
                Get in touch ↗
              </Button>
            </li>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
