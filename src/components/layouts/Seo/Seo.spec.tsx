import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { baseURL, siteName } from '../../../config/constants';
import Seo from './index';

// next/head does not render into the container in jsdom; render children inline.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Seo', () => {
  it('uses the site name for og:site_name, not the page title', () => {
    const { container } = render(<Seo pageTitle="記事一覧" />);
    const siteNameMeta = container.querySelector(
      'meta[property="og:site_name"]'
    );
    expect(siteNameMeta?.getAttribute('content')).toBe(siteName);
    const ogTitle = container.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe(`記事一覧 | ${siteName}`);
  });

  it('uses pagePath for canonical and og:url', () => {
    const url = `${baseURL}/articles`;
    const { container } = render(<Seo pagePath={url} />);
    expect(
      container.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe(url);
    expect(
      container
        .querySelector('meta[property="og:url"]')
        ?.getAttribute('content')
    ).toBe(url);
  });

  it('renders exactly one <title>', () => {
    const { container } = render(<Seo />);
    expect(container.querySelectorAll('title').length).toBe(1);
  });
});
