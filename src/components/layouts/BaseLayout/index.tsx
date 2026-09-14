import { ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-brand-fg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[4px] focus:border focus:border-brand-border-strong focus:bg-brand-bg focus:px-4 focus:py-2 focus:font-brand-mono focus:text-[13px] focus:text-brand-fg focus:outline-none focus:ring-2 focus:ring-brand-orb-violet"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default BaseLayout;
