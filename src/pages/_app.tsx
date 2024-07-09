import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { globalPageTitle } from '../config/constants';
import { GA_MEASUREMENT_ID, pageview } from '../libs/gtag';
import { theme } from '../theme/theme';

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

  return (
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
      <Head>
        <title>{globalPageTitle}</title>
      </Head>
      <main className="app">
        <ChakraProvider theme={theme}>
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </ChakraProvider>
      </main>
    </>
  );
}
