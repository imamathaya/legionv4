import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const dynamic = "force-static";

export function GET() {
  const body = readFileSync(resolve(process.cwd(), "../../llms.txt"), "utf8");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
