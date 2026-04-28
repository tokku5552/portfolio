import { ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-brand-fg">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default BaseLayout;
