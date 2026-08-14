import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("prerenders the Aurora Bar homepage", async () => {
  const html = await readFile(
    new URL("../.next/server/app/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>Aurora Bar[^<]*<\/title>/i);
  assert.match(html, /Your table is/i);
});
