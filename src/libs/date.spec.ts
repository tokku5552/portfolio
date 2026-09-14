import { formatDate } from './date';

describe('date', () => {
  test('formatDate', () => {
    const date = formatDate('2021-01-01T00:00:00.000Z');
    expect(date).toBe('2021-01-01');
  });

  test('formatDate は実行環境の TZ に依存せず JST の日付を返す', () => {
    // UTC 14:59 は JST 23:59 で同日
    expect(formatDate('2020-12-31T14:59:59.999Z')).toBe('2020-12-31');
    // UTC 15:00 以降は JST で翌日（年またぎ）
    expect(formatDate('2020-12-31T15:00:00.000Z')).toBe('2021-01-01');
    // オフセット付き ISO 文字列も JST に正規化される
    expect(formatDate('2024-02-29T23:30:00-08:00')).toBe('2024-03-01');
  });

  test('formatDate は不正な日付文字列に空文字を返す', () => {
    expect(formatDate('invalid')).toBe('');
  });
});
