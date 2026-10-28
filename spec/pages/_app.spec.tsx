import { act, render } from '@testing-library/react';
import { useRouter } from 'next/router';
import App from '../../src/pages/_app';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

type Handler = (url: string) => void;

describe('App', () => {
  const handlers = new Map<string, Handler>();
  const events = {
    on: jest.fn((event: string, handler: Handler) =>
      handlers.set(event, handler)
    ),
    off: jest.fn((event: string) => handlers.delete(event)),
  };
  const gtagMock = jest.fn();

  beforeEach(() => {
    handlers.clear();
    (useRouter as jest.Mock).mockReturnValue({ events });
    window.gtag = gtagMock as unknown as typeof window.gtag;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderApp = () =>
    render(
      <App
        Component={() => <p>page body</p>}
        pageProps={{}}
        router={{} as never}
      />
    );

  test('renders the page inside BaseLayout', () => {
    const { container } = renderApp();
    expect(container.querySelector('#main-content')?.textContent).toBe(
      'page body'
    );
    expect(container.querySelector('header')).not.toBeNull();
    expect(container.querySelector('footer')).not.toBeNull();
  });

  test('sends a GA page view on every route change', () => {
    renderApp();
    gtagMock.mockClear();

    act(() => handlers.get('routeChangeComplete')?.('/articles'));

    expect(gtagMock).toHaveBeenCalledWith('config', 'TEST_GA_ID', {
      page_path: '/articles',
    });
  });

  test('stops listening to route changes on unmount', () => {
    const { unmount } = renderApp();
    unmount();
    expect(events.off).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function)
    );
    expect(handlers.has('routeChangeComplete')).toBe(false);
  });
});
