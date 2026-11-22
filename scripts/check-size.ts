import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const BUDGET_BYTES = 4096;
const path = resolve("packages/ui/dist/components/ui/button.js");

if (!statSync(path).isFile()) {
  console.error("check:size failed: build packages/ui before measuring.");
  process.exit(1);
}

const source = readFileSync(path);
const gzip = gzipSync(source, { level: 9 });
if (gzip.byteLength > BUDGET_BYTES) {
  console.error(
    `check:size failed: button.js is ${gzip.byteLength} B gzipped, budget is ${BUDGET_BYTES} B.`,
  );
  process.exit(1);
}

console.log(
  `check:size passed: button.js ${gzip.byteLength} B gzipped (${source.byteLength} B raw), budget ${BUDGET_BYTES} B.`,
);
