import { lineSummaryLpUrl } from '../../../config/constants';
import { createDom } from '../../article/apis/createDom';
import { FETCH_TIMEOUT_MS } from '../../article/apis/fetchConfig';
import { extractOgp } from '../../article/functions/extractOgp';

/** Product landing pages whose og:image we hydrate at build time. */
const WORK_OGP_URLS = [lineSummaryLpUrl];

/**
 * Works セクションの各プロダクト LP から og:image を取得する。
 * note.ts の OGP 取得と同じ手順 (fetch → JSDOM → extractOgp) を踏襲する。
 * 取得に失敗した URL はマップから除外され、カードはテキストのみで描画される。
 */
export const fetchWorksOgpImages = async (): Promise<
  Record<string, string>
> => {
  const entries = await Promise.all(
    WORK_OGP_URLS.map(async (url) => [url, await fetchOgImage(url)] as const)
  );
  return Object.fromEntries(entries.filter(([, imageUrl]) => imageUrl !== ''));
};

const fetchOgImage = async (url: string): Promise<string> => {
  try {
    const res = await fetch(encodeURI(url), {
      headers: {
        'User-Agent': 'bot',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.warn(
        `Failed to fetch Works OGP: ${res.status} ${res.statusText} (${url})`
      );
      return '';
    }

    const html = await res.text();
    const dom = createDom(html);
    const meta = dom.window.document.head.querySelectorAll('meta');
    const ogp = extractOgp([...Array.from(meta)]);
    return ogp['og:image'] ?? '';
  } catch (error) {
    console.warn(
      `Failed to fetch OGP from Works LP ${url}:`,
      error instanceof Error ? error.message : error
    );
    return '';
  }
};
