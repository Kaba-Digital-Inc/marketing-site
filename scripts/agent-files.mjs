// Build step: writes a markdown twin of every page, plus llms.txt and llms-full.txt, into dist.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";

const SITE = "https://kabadigitalinc.com";
const nhm = new NodeHtmlMarkdown({ useInlineLinks: true, maxConsecutiveNewlines: 2 });

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

const pick = (html, re) => (html.match(re)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();

/** URL path ("/services/x/") to markdown file path ("/services/x.md"). */
export const mdPath = (urlPath) => (urlPath === "/" ? "/index.md" : urlPath.replace(/\/$/, "") + ".md");

export async function buildAgentFiles(distDir) {
  const pages = [];
  for (const file of await walk(distDir)) {
    const rel = "/" + path.relative(distDir, path.dirname(file)).split(path.sep).filter(Boolean).join("/");
    const urlPath = rel === "/" ? "/" : rel + "/";
    if (urlPath === "/404/") continue;
    const html = await readFile(file, "utf8");
    const title = pick(html, /<title>([^<]*)<\/title>/);
    const description = pick(html, /<meta name="description" content="([^"]*)"/);
    const main = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/)?.[1];
    if (!main) continue;
    const cleaned = main
      .replace(/<!--md-skip-start-->[\s\S]*?<!--md-skip-end-->/g, "")
      .replace(/<(script|style|svg|form|button|noscript)[\s\S]*?<\/\1>/gi, "")
      .replace(/<astro-island[^>]*>/gi, "<div>")
      .replace(/<\/astro-island>/gi, "</div>");
    // Keep text inside a link on one line, with spaces between its blocks, and drop arrow decoration.
    const flat = cleaned.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (a) =>
      a.replace(/<\/(h[1-6]|p|span|div|li)>/gi, "$& ").replace(/(?:Learn more|Read more|Read the guide)?\s*(?:→|&rarr;)/gi, "").replace(/\s+/g, " "),
    );
    const body = nhm
      .translate(flat)
      .replace(/ (?:Learn more|Read more) \]\(/g, "](")
      .replace(/\]\((\/[^)\s]*)\)/g, (_, href) => `](${SITE}${href})`).replace(/\n{3,}/g, "\n\n").trim();
    const md = `# ${title}\n\n> ${description}\n\nSource: ${SITE}${urlPath}\n\n${body}\n`;
    const out = path.join(distDir, mdPath(urlPath));
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, md);
    pages.push({ urlPath, title, description, md });
  }
  pages.sort((a, b) => a.urlPath.length - b.urlPath.length || a.urlPath.localeCompare(b.urlPath));

  const groups = [
    ["Start here", (p) => ["/", "/about/", "/contact/", "/for-agents/"].includes(p.urlPath)],
    ["Who we help", (p) => ["/startups/", "/ai-native/", "/enterprise/", "/investors/"].includes(p.urlPath)],
    ["Services", (p) => p.urlPath.startsWith("/services") || p.urlPath === "/cloudflare/" || p.urlPath === "/stack/"],
    ["Work and partners", (p) => p.urlPath.startsWith("/work") || p.urlPath.startsWith("/partners")],
    ["Insights", (p) => p.urlPath.startsWith("/insights")],
    ["Locations", (p) => p.urlPath.startsWith("/locations")],
  ];
  const used = new Set();
  let index = `# Kaba Digital Inc.\n\n> Toronto AI engineering studio. We build and run production AI agents and automation for small businesses, startups, and enterprises, run hands-on AI labs and workshops for teams, and partner with selected startups for pay plus equity. We cannot guarantee outcomes, and say so.\n\nEvery page below is also available as clean markdown. The full site in one file is at ${SITE}/llms-full.txt. Contact: team@kabadigitalinc.com.\n`;
  for (const [name, test] of groups) {
    const list = pages.filter((p) => test(p) && !used.has(p.urlPath));
    if (!list.length) continue;
    list.forEach((p) => used.add(p.urlPath));
    index += `\n## ${name}\n\n` + list.map((p) => `- [${p.title.replace(/ \| Kaba Digital Inc\.$/, "")}](${SITE}${mdPath(p.urlPath)}): ${p.description}`).join("\n") + "\n";
  }
  const rest = pages.filter((p) => !used.has(p.urlPath));
  if (rest.length) index += `\n## Optional\n\n` + rest.map((p) => `- [${p.title.replace(/ \| Kaba Digital Inc\.$/, "")}](${SITE}${mdPath(p.urlPath)}): ${p.description}`).join("\n") + "\n";
  await writeFile(path.join(distDir, "llms.txt"), index);
  await writeFile(path.join(distDir, "llms-full.txt"), pages.map((p) => p.md).join("\n---\n\n"));
  return pages.length;
}

export default function agentFiles() {
  return {
    name: "agent-files",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const n = await buildAgentFiles(fileURLToPath(dir));
        logger.info(`wrote ${n} markdown pages, llms.txt, llms-full.txt`);
      },
    },
  };
}
