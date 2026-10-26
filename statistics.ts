export const VALUES = [1, 2, 3, 4, 5] as const;

export type FrequencyRow = {
  value: number;
  count: number;
  relative: number;
  cumulativeCount: number;
  cumulativeRelative: number;
};

// Базовий генератор повертає z з [0, 1). Перетворення: x = floor(5z) + 1.
export function generateSample(
  n: number,
  random: () => number = Math.random,
): number[] {
  if (!Number.isSafeInteger(n) || n <= 0)
    throw new Error("Обсяг має бути додатним цілим.");
  return Array.from({ length: n }, () => {
    const z = random();
    if (!Number.isFinite(z) || z < 0 || z >= 1)
      throw new Error("Потрібно 0 <= z < 1.");
    return Math.floor(VALUES.length * z) + 1;
  });
}

// Сортування вставками. Початковий масив зберігаємо без змін.
export function insertionSort(data: readonly number[]): number[] {
  const sorted = [...data];
  for (let i = 1; i < sorted.length; i++) {
    const key = sorted[i];
    let j = i - 1;
    // Зсуваємо більші елементи відсортованого префікса вправо.
    while (j >= 0 && sorted[j] > key) {
      sorted[j + 1] = sorted[j];
      j--;
    }
    sorted[j + 1] = key;
  }
  return sorted;
}

export function analyze(data: readonly number[]) {
  if (data.length === 0) throw new Error("Вибірка не може бути порожньою.");
  const counts = new Map<number, number>(VALUES.map((x) => [x, 0]));
  for (const x of data) {
    if (!counts.has(x))
      throw new Error("Значення мають належати набору 1, 2, 3, 4, 5.");
    counts.set(x, counts.get(x)! + 1);
  }
  const sorted = insertionSort(data);
  const n = data.length;
  let cumulativeCount = 0;
  const distribution: FrequencyRow[] = VALUES.map((value) => {
    const count = counts.get(value)!;
    cumulativeCount += count;
    return {
      value,
      count,
      relative: count / n,
      cumulativeCount,
      // Ділимо цілу накопичену частоту, щоб не накопичувати похибку сумування.
      cumulativeRelative: cumulativeCount / n,
    };
  });
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const middle = Math.floor(n / 2);
  const median =
    n % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  const maxCount = Math.max(...distribution.map((row) => row.count));
  const modes = distribution
    .filter((row) => row.count === maxCount)
    .map((row) => row.value);
  return {
    n,
    sorted,
    distribution,
    range: sorted[n - 1] - sorted[0],
    mean,
    median,
    modes,
  };
}
