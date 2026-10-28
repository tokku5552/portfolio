import { lineSummaryLpUrl } from '../../../config/constants';
import { fetchWorksOgpImages } from './works';

describe('fetchWorksOgpImages', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    delete (globalThis as { fetch?: typeof fetch }).fetch;
    jest.restoreAllMocks();
  });

  test('LP の og:image を URL ごとに返す', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () =>
        '<html><head><meta property="og:image" content="https://example.com/lp.png" /></head></html>',
    });

    await expect(fetchWorksOgpImages()).resolves.toEqual({
      [lineSummaryLpUrl]: 'https://example.com/lp.png',
    });
    expect(fetchMock.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
  });

  test('取得に失敗した LP はマップから除外する', async () => {
    fetchMock.mockRejectedValue(new Error('network error'));

    await expect(fetchWorksOgpImages()).resolves.toEqual({});
  });

  test('og:image の無い LP はマップから除外する', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<html><head></head></html>',
    });

    await expect(fetchWorksOgpImages()).resolves.toEqual({});
  });
});
