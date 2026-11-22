import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const dynamic = "force-static";

export function GET() {
  const body = readFileSync(resolve(process.cwd(), "public/llms.txt"), "utf8");
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
