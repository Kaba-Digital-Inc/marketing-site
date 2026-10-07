// After the real domain is live: node scripts/indexnow.mjs
// Tells Bing and other IndexNow engines (which feed ChatGPT search) about every page.
import { readFile } from "node:fs/promises";
const host = "kabadigitalinc.com";
const key = "f374f171d8f0219b29e1a8b2536b324a";
const xml = await readFile(new URL("../dist/sitemap-0.xml", import.meta.url), "utf8");
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith("https://" + host));
const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(res.status, res.statusText, urlList.length + " URLs");
