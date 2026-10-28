describe('pageview', () => {
  const gtagMock = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    gtagMock.mockReset();
    window.gtag = gtagMock as unknown as typeof window.gtag;
  });

  test('sends the page path to the configured GA measurement ID', async () => {
    const { pageview, GA_MEASUREMENT_ID } = await import('./gtag');
    pageview('/articles');
    expect(GA_MEASUREMENT_ID).toBe('TEST_GA_ID');
    expect(gtagMock).toHaveBeenCalledWith('config', 'TEST_GA_ID', {
      page_path: '/articles',
    });
  });

  test('does nothing when no measurement ID is set', async () => {
    const original = process.env.NEXT_PUBLIC_GA_ID;
    process.env.NEXT_PUBLIC_GA_ID = '';
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { pageview } = await import('./gtag');
      pageview('/articles');
      expect(gtagMock).not.toHaveBeenCalled();
    } finally {
      process.env.NEXT_PUBLIC_GA_ID = original;
    }
  });
});
