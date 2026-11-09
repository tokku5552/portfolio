import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { baseURL, siteName } from '../../../config/constants';
import Seo from './index';

// next/head does not render into the container in jsdom; render children inline.
// React 19 then hoists <title>, <meta> and <link> into document.head, so query
// the document rather than the render container.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Seo', () => {
  it('uses the site name for og:site_name, not the page title', () => {
    render(<Seo pageTitle="記事一覧" />);
    const siteNameMeta = document.querySelector(
      'meta[property="og:site_name"]'
    );
    expect(siteNameMeta?.getAttribute('content')).toBe(siteName);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe(`記事一覧 | ${siteName}`);
  });

  it('uses pagePath for canonical and og:url', () => {
    const url = `${baseURL}/articles`;
    render(<Seo pagePath={url} />);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe(url);
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute('content')
    ).toBe(url);
  });

  it('renders exactly one <title>', () => {
    render(<Seo />);
    expect(document.querySelectorAll('title').length).toBe(1);
  });
});
