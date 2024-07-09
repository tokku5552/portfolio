import { usePathname } from 'next/navigation';
import Footer from '../Footer';
import Hero from '../Hero';

const withoutHeroPaths = ['/'];

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const path = usePathname();

  // Heroを表示しないページ
  if (withoutHeroPaths.includes(path)) {
    return (
      <>
        <main>{children}</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Hero />
      <main>{children}</main>
      <Footer />
    </>
  );
}
