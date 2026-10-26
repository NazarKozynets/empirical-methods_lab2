import { writeFileSync } from "node:fs"; 
import { analyze, generateSample } from "./statistics.ts";

const variant = 14;
const sample = generateSample(variant + 10);
const statistics = analyze(sample);
const result = { variant, sample, ...statistics, node: process.version };
const decimal = (x: number) => x.toFixed(6);

const lines = [
  "Лабораторна робота 2. Варіант 14",
  `Обсяг вибірки n = ${statistics.n}`,
  `Вихідні дані: ${sample.join(" ")}`,
  `Варіаційний ряд: ${statistics.sorted.join(" ")}`,
  "",
  " x_i | n_i |  w_i=n_i/n | N_i | F_i=N_i/n",
  "-----+-----+------------+-----+-----------",
];

for (const row of statistics.distribution) {
  lines.push(
    `${String(row.value).padStart(4)} | ${String(row.count).padStart(3)} | ` +
      `${decimal(row.relative).padStart(10)} | ${String(row.cumulativeCount).padStart(3)} | ` +
      decimal(row.cumulativeRelative),
  );
}

const totalCount = statistics.distribution.reduce(
  (sum, row) => sum + row.count,
  0,
);

const totalRelative = statistics.distribution.reduce(
  (sum, row) => sum + row.relative,
  0,
);

lines.push(
  "",
  `Перевірки: сума n_i = ${totalCount}; сума w_i = ${decimal(totalRelative)}; F_5 = 1`,
  `Розмах R = ${statistics.range}; середнє = ${decimal(statistics.mean)}`,
  `Медіана = ${statistics.median}; моди = ${statistics.modes.join(", ")}`,
);

writeFileSync(
  new URL("./results.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
writeFileSync(
  new URL("./results.txt", import.meta.url),
  lines.join("\n") + "\n",
);
console.log(lines.join("\n"));
