/**
 * Maps `items` through an async `mapper`, running at most `limit` mappers at
 * the same time. Results keep the input order.
 *
 * Rejections are not caught here: callers that need per-item failure
 * isolation should handle errors inside `mapper`.
 */
export const mapWithConcurrency = async <T, R>(
  items: readonly T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index], index);
    }
  };

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
};
