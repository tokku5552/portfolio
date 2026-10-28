import { cn } from './cn';

describe('cn', () => {
  test('joins class names and drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  test('flattens arrays and object syntax', () => {
    expect(cn(['a', ['b']], { c: true, d: false })).toBe('a b c');
  });

  test('keeps the last of conflicting Tailwind utilities', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-brand-muted', 'text-brand-fg')).toBe('text-brand-fg');
  });

  test('treats arbitrary values as conflicting with their utility group', () => {
    expect(cn('text-sm', 'text-[13px]')).toBe('text-[13px]');
    expect(cn('rounded-md', 'rounded-[4px]')).toBe('rounded-[4px]');
  });
});
