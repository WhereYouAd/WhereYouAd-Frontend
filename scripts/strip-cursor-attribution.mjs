/**
 * Cursor 에이전트가 붙이는 Git 메시지 trailer 제거.
 * GitHub가 Co-authored-by를 파싱해 Cursor 아바타를 붙이는 것을 막기 위함.
 */
import { readFileSync, writeFileSync } from "node:fs";

const path = process.argv[2];
if (!path) process.exit(0);

let text = readFileSync(path, "utf8");
const next = text
  .split("\n")
  .filter(
    (line) =>
      !/^Co-authored-by:\s*Cursor\b/i.test(line) &&
      !/^Made-with:\s*Cursor\b/i.test(line),
  )
  .join("\n");

if (next !== text) writeFileSync(path, next);
