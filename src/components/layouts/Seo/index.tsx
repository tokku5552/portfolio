/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head';
import { globalCoverUrl, globalPageTitle } from '../../../config/constants';
import { stripHtmlTags } from '../../../libs/text';

export interface MetaData {
  pageTitle?: string;
  pageDescription?: string;
  pagePath?: string;
  pageImg?: string;
  pageImgWidth?: number;
  pageImgHeight?: number;
}

const Seo = ({
  pageTitle,
  pageDescription,
  pagePath,
  pageImg,
  pageImgWidth,
  pageImgHeight,
}: MetaData) => {
  const defaultTitle = globalPageTitle;
  const defaultDescription = '';

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const description = pageDescription
    ? stripHtmlTags(pageDescription)
    : stripHtmlTags(defaultDescription);
  const url = pagePath;
  const imgUrl = pageImg ? pageImg : globalCoverUrl;
  const imgWidth = pageImgWidth ? pageImgWidth : 1280;
  const imgHeight = pageImgHeight ? pageImgHeight : 640;

  const twitterCard = 'summary_large_image';
  const twitterSite = '@tokkuu';

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:image" content={imgUrl} />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;display=swap"
        rel="stylesheet"
      />
      <link rel="canonical" href={url} />
    </Head>
  );
};

export default Seo;
