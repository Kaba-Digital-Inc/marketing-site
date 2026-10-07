// WebMCP: lets an AI agent that is browsing this page call a few read-only tools.
// Only registers when the browser supports it. Reads public pages already on this site; sends nothing anywhere.
(function () {
  if (window.__kabaWebMcp) return;
  var ctx = (navigator && navigator.modelContext) || (document && document.modelContext);
  if (!ctx) return;
  window.__kabaWebMcp = true;

  var FACTS =
    "Kaba Digital Inc. is a Toronto AI engineering studio. We build and run production AI agents and automation for small businesses, startups, and enterprises, run hands-on AI labs and workshops for teams, and partner with selected startups for pay plus equity. We cannot guarantee outcomes, and we are not a partner of any AI vendor unless a page says so in writing. Contact: team@kabadigitalinc.com. Book a call: /contact/. Office address: 2967 Dundas St. W., #676, Toronto, ON M6P 1Z2, Canada.";

  var pagesPromise;
  function pages() {
    if (!pagesPromise) {
      pagesPromise = fetch("/llms-full.txt")
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (raw) {
          return raw.split("\n---\n\n").map(function (chunk) {
            var t = chunk.match(/^# (.+)$/m);
            var u = chunk.match(/^Source: (\S+)$/m);
            return { title: t ? t[1] : "", url: u ? u[1] : "", text: chunk };
          }).filter(function (p) { return p.url; });
        })
        .catch(function () { return []; });
    }
    return pagesPromise;
  }

  function text(s, isError) {
    return { content: [{ type: "text", text: s }], isError: !!isError };
  }

  var tools = [
    {
      name: "about_studio",
      description: "Who Kaba Digital Inc. is, what it does, where it is based, and how to contact it.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: function () { return Promise.resolve(text(FACTS)); },
    },
    {
      name: "search_site",
      description: "Search this site's pages for a topic, such as 'AI workshops', 'startup partnership', or 'Cloudflare agents'. Returns the best matches with a short excerpt.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string", description: "What to look for", maxLength: 200 } },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: function (args) {
        var terms = String((args && args.query) || "").toLowerCase().split(/\W+/).filter(function (t) { return t.length > 2; });
        if (!terms.length) return Promise.resolve(text("Give a query of at least one word.", true));
        return pages().then(function (list) {
          var hits = list.map(function (p) {
            var lower = p.text.toLowerCase();
            var score = 0, first = -1;
            terms.forEach(function (t) {
              score += lower.split(t).length - 1;
              if (p.title.toLowerCase().indexOf(t) !== -1) score += 5;
              if (first < 0) first = lower.indexOf(t);
            });
            var at = Math.max(0, first);
            return { p: p, score: score, excerpt: p.text.slice(Math.max(0, at - 80), at + 240).replace(/\s+/g, " ").trim() };
          }).filter(function (h) { return h.score > 0; })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, 5);
          if (!hits.length) return text("No pages matched. Try a different word.");
          return text(hits.map(function (h) { return h.p.title + "\n" + h.p.url + "\n" + h.excerpt; }).join("\n\n"));
        });
      },
    },
    {
      name: "get_page",
      description: "Read one page of this site as markdown, for example path '/services/ai-workshops/' or '/investors/'.",
      inputSchema: {
        type: "object",
        properties: { path: { type: "string", description: "Page path starting with /", maxLength: 120 } },
        required: ["path"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: function (args) {
        var path = String((args && args.path) || "");
        if (!/^\/[a-z0-9\/_-]*$/i.test(path)) return Promise.resolve(text("Path must look like /services/ai-workshops/.", true));
        var md = path === "/" ? "/index.md" : path.replace(/\/$/, "") + ".md";
        return fetch(md).then(function (r) {
          return r.ok ? r.text().then(function (t) { return text(t); }) : text("No page at " + path, true);
        }).catch(function () { return text("Could not load that page.", true); });
      },
    },
  ];

  try {
    if (typeof ctx.registerTool === "function") {
      tools.forEach(function (t) { try { ctx.registerTool(t); } catch (e) {} });
    } else if (typeof ctx.provideContext === "function") {
      ctx.provideContext({ tools: tools });
    }
  } catch (e) {}
})();
