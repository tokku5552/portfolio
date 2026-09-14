import { mapWithConcurrency } from './mapWithConcurrency';

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('mapWithConcurrency', () => {
  test('同時実行数が limit を超えない', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const resolvers: (() => void)[] = [];

    const promise = mapWithConcurrency(
      Array.from({ length: 12 }, (_, i) => i),
      5,
      async (item) => {
        inFlight++;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise<void>((resolve) => resolvers.push(resolve));
        inFlight--;
        return item;
      }
    );

    while (resolvers.length > 0 || inFlight > 0) {
      await flushMicrotasks();
      expect(inFlight).toBeLessThanOrEqual(5);
      resolvers.splice(0).forEach((resolve) => resolve());
    }

    await promise;
    expect(maxInFlight).toBe(5);
  });

  test('完了順に関わらず入力順で結果を返す', async () => {
    const delays = [30, 10, 20, 0];
    const result = await mapWithConcurrency(delays, 2, async (delay, index) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return `item-${index}`;
    });

    expect(result).toEqual(['item-0', 'item-1', 'item-2', 'item-3']);
  });

  test('空配列なら mapper を呼ばずに空配列を返す', async () => {
    const mapper = jest.fn();
    const result = await mapWithConcurrency([], 5, mapper);

    expect(result).toEqual([]);
    expect(mapper).not.toHaveBeenCalled();
  });

  test('limit が要素数より大きくても全件を処理する', async () => {
    const result = await mapWithConcurrency([1, 2], 10, async (n) => n * 2);

    expect(result).toEqual([2, 4]);
  });

  test('mapper の reject はそのまま伝播する', async () => {
    await expect(
      mapWithConcurrency([1, 2, 3], 2, async (n) => {
        if (n === 2) throw new Error('boom');
        return n;
      })
    ).rejects.toThrow('boom');
  });
});
