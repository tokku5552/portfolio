import { formatDate } from './date';

describe('date', () => {
  test('formatDate', () => {
    const date = formatDate('2021-01-01T00:00:00.000Z');
    expect(date).toBe('2021-01-01');
  });
});
