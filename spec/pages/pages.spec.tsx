import { render } from '@testing-library/react';
import { fetchArticles } from '../../src/features/article/apis/article';
import { Article } from '../../src/features/article/types/article';
import { fetchWorksOgpImages } from '../../src/features/home/apis/works';
import NotFoundPage from '../../src/pages/404';
import ArticlesPage, {
  getStaticProps as getArticlesStaticProps,
} from '../../src/pages/articles';
import BrandPage from '../../src/pages/brand';
import HomePage, {
  getStaticProps as getHomeStaticProps,
} from '../../src/pages/index';

jest.mock('../../src/features/article/apis/article');
jest.mock('../../src/features/home/apis/works');

const article: Article = {
  title: 'Mocked article',
  bodySummary: 'summary',
  source: 'zenn',
  url: 'https://example.com/mocked',
  publishedAt: '2025-01-01T00:00:00.000Z',
  imageUrl: '',
};

const fetchArticlesMock = fetchArticles as jest.MockedFunction<
  typeof fetchArticles
>;
const fetchWorksOgpImagesMock = fetchWorksOgpImages as jest.MockedFunction<
  typeof fetchWorksOgpImages
>;

const h1Text = (container: HTMLElement) =>
  container.querySelector('h1')?.textContent ?? '';

describe('pages', () => {
  let getContext: jest.SpyInstance;

  beforeEach(() => {
    fetchArticlesMock.mockResolvedValue([article]);
    fetchWorksOgpImagesMock.mockResolvedValue({
      'https://example.com/lp': 'https://example.com/lp.png',
    });
    // ParticleField falls back when WebGL is unavailable.
    getContext = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(null);
  });

  afterEach(() => {
    getContext.mockRestore();
    jest.resetAllMocks();
  });

  describe('/', () => {
    test('getStaticProps returns the latest 3 articles and Works OGP images', async () => {
      const result = await getHomeStaticProps({});

      expect(fetchArticlesMock).toHaveBeenCalledWith(3);
      expect(result).toEqual({
        props: {
          articles: [article],
          worksOgpImages: {
            'https://example.com/lp': 'https://example.com/lp.png',
          },
        },
      });
    });

    test('renders with its static props', async () => {
      const result = await getHomeStaticProps({});
      const props = (result as { props: Parameters<typeof HomePage>[0] }).props;
      const { container } = render(<HomePage {...props} />);

      expect(container.querySelector('#hero')).not.toBeNull();
      expect(container.textContent).toContain('Mocked article');
    });
  });

  describe('/articles', () => {
    test('getStaticProps returns every article', async () => {
      const result = await getArticlesStaticProps({});

      expect(fetchArticlesMock).toHaveBeenCalledWith();
      expect(result).toEqual({ props: { articles: [article] } });
    });

    test('renders with its static props', async () => {
      const result = await getArticlesStaticProps({});
      const props = (result as { props: Parameters<typeof ArticlesPage>[0] })
        .props;
      const { container } = render(<ArticlesPage {...props} />);

      expect(h1Text(container)).toContain('Articles');
      expect(container.textContent).toContain('Mocked article');
    });
  });

  test('/brand renders', () => {
    const { container } = render(<BrandPage />);
    expect(h1Text(container)).toContain('Twilight Blade');
  });

  test('404 renders', () => {
    const { container } = render(<NotFoundPage />);
    expect(h1Text(container)).toContain('Lost');
  });
});
