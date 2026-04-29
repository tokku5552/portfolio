import { JSDOM } from 'jsdom';
import { stripHtmlTags, truncateText } from '../../../libs/text';
import { Article } from '../types/article';
import { NoteRssItem } from '../types/note';

const NOTE_USERNAME = 'tokku5552';
const NOTE_RSS_URL = `https://note.com/${NOTE_USERNAME}/rss`;

/**
 * note.com の記事を取得する
 * 公式RSSフィードから取得（認証不要、ビルド時に取得）
 * ref: https://note.com/{username}/rss
 */
export const fetchArticlesFromNote = async (): Promise<Article[]> => {
  try {
    const res = await fetch(NOTE_RSS_URL, {
      headers: {
        'User-Agent': 'bot',
      },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch note RSS: ${res.status} ${res.statusText}`);
      return [];
    }

    const xml = await res.text();
    const items = parseNoteRss(xml);
    return items.map(toArticleFromNote);
  } catch (error) {
    console.warn(
      'Failed to fetch note articles:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
};

const MEDIA_NS = 'http://search.yahoo.com/mrss/';

export const parseNoteRss = (xml: string): NoteRssItem[] => {
  const dom = new JSDOM(xml, { contentType: 'text/xml' });
  const items = Array.from(dom.window.document.getElementsByTagName('item'));

  return items.map((item) => {
    const getText = (tag: string) =>
      item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';

    const description = getText('description');
    const mediaThumb =
      item.getElementsByTagNameNS(MEDIA_NS, 'thumbnail')[0] ??
      item.getElementsByTagName('media:thumbnail')[0];
    const enclosure = item.getElementsByTagName('enclosure')[0];
    const thumbnailUrl =
      mediaThumb?.getAttribute('url') ??
      enclosure?.getAttribute('url') ??
      extractFirstImgSrc(description) ??
      '';

    return {
      title: getText('title'),
      link: getText('link'),
      description,
      pubDate: getText('pubDate'),
      thumbnailUrl,
    };
  });
};

const extractFirstImgSrc = (html: string): string | null => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
};

const toArticleFromNote = (item: NoteRssItem): Article => ({
  title: item.title,
  bodySummary: truncateText(stripHtmlTags(item.description), 100),
  source: 'note',
  url: item.link,
  publishedAt: new Date(item.pubDate).toISOString(),
  imageUrl: item.thumbnailUrl,
});
