import { parseNoteRss } from './note';

const sampleRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>tokku5552 のnote</title>
    <link>https://note.com/tokku5552</link>
    <description>tokku5552 のnote記事</description>
    <item>
      <title>はじめての記事</title>
      <link>https://note.com/tokku5552/n/n1234567890ab</link>
      <description><![CDATA[<p>これは note.com の記事の本文サマリです。</p><img src="https://example.com/inline.jpg" alt="inline" />]]></description>
      <pubDate>Mon, 14 Apr 2025 12:00:00 GMT</pubDate>
      <guid isPermaLink="true">https://note.com/tokku5552/n/n1234567890ab</guid>
      <media:thumbnail url="https://assets.note.com/thumbnail/n1234567890ab.jpg" />
    </item>
    <item>
      <title>サムネイル無しの記事</title>
      <link>https://note.com/tokku5552/n/nffffffffffff</link>
      <description><![CDATA[<p>サムネイル無し。</p>]]></description>
      <pubDate>Sun, 13 Apr 2025 03:30:00 GMT</pubDate>
      <guid isPermaLink="true">https://note.com/tokku5552/n/nffffffffffff</guid>
    </item>
  </channel>
</rss>`;

describe('parseNoteRss', () => {
  test('item 要素から title / link / pubDate / thumbnail を抽出する', () => {
    const items = parseNoteRss(sampleRss);

    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      title: 'はじめての記事',
      link: 'https://note.com/tokku5552/n/n1234567890ab',
      description: expect.stringContaining('note.com の記事の本文サマリ'),
      pubDate: 'Mon, 14 Apr 2025 12:00:00 GMT',
      thumbnailUrl: 'https://assets.note.com/thumbnail/n1234567890ab.jpg',
    });
  });

  test('media:thumbnail が無い場合は description 内の img を fallback として使う', () => {
    const items = parseNoteRss(sampleRss);

    expect(items[1].thumbnailUrl).toBe('');
  });

  test('description 内の img を fallback として使う', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>fallback</title>
      <link>https://note.com/tokku5552/n/abcd</link>
      <description><![CDATA[<p>x</p><img src="https://example.com/fallback.jpg" />]]></description>
      <pubDate>Mon, 14 Apr 2025 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
    const [item] = parseNoteRss(xml);
    expect(item.thumbnailUrl).toBe('https://example.com/fallback.jpg');
  });
});
