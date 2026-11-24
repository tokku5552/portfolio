import '@/styles/globals.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { GA_MEASUREMENT_ID, pageview } from '../libs/gtag';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouterChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouterChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouterChange);
    };
  }, [router.events]);

  // A page sets `Page.standalone = true` to render without the site chrome
  // (e.g. the /consulting LP, which brings its own header and footer).
  const { standalone } = Component as { standalone?: boolean };

  return (
    <>
      <Head>
        {/* Keyed so a page can override it (the light /consulting LP does). */}
        <meta name="theme-color" content="#0a0a12" key="theme-color" />
      </Head>
      {GA_MEASUREMENT_ID ? (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${GA_MEASUREMENT_ID}');
        `,
            }}
          />
        </>
      ) : null}
      {standalone ? (
        <Component {...pageProps} />
      ) : (
        <BaseLayout>
          <Component {...pageProps} />
        </BaseLayout>
      )}
    </>
  );
}
