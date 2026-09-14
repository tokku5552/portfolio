import { stripHtmlTags, truncateText } from './text';

describe('text', () => {
  describe('stripHtmlTags', () => {
    it('removes HTML tags and keeps inner text', () => {
      expect(stripHtmlTags('<p>Hello <strong>world</strong></p>')).toBe(
        'Hello world'
      );
    });

    it('returns an empty string for empty or non-string input', () => {
      expect(stripHtmlTags('')).toBe('');
      expect(stripHtmlTags(undefined as unknown as string)).toBe('');
      expect(stripHtmlTags(123 as unknown as string)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('returns the string as-is when within the limit', () => {
      expect(truncateText('abc', 3)).toBe('abc');
    });

    it('truncates and appends an ellipsis when over the limit', () => {
      expect(truncateText('abcdef', 3)).toBe('abc...');
    });

    it('defaults to 100 characters', () => {
      const long = 'a'.repeat(120);
      expect(truncateText(long)).toBe(`${'a'.repeat(100)}...`);
      expect(truncateText('a'.repeat(100))).toBe('a'.repeat(100));
    });

    it('returns an empty string for empty or non-string input', () => {
      expect(truncateText('')).toBe('');
      expect(truncateText(null as unknown as string)).toBe('');
    });
  });
});
