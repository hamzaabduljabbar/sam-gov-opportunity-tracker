// Local proxy + static server for the SAM.gov tracker.
// Proxies the same internal endpoint the sam.gov website itself uses:
//   https://sam.gov/api/prod/sgs/v1/search
// Run:  node server.js   (then open http://localhost:5188)

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 5188;
const ROOT = __dirname;
const SAM_HOST = "sam.gov";
const SAM_PATH = "/api/prod/sgs/v1/search";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".ico":  "image/x-icon",
};

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  const filePath = path.join(ROOT, rel);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}

function proxySam(req, res) {
  const incoming = new URL(req.url, "http://localhost");
  const qs = incoming.search || "";
  const options = {
    host: SAM_HOST,
    path: SAM_PATH + qs,
    method: "GET",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      // Mimic a browser; sam.gov's internal endpoint rejects bare clients
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Referer": "https://sam.gov/search/",
      "Origin": "https://sam.gov",
    },
  };
  console.log(`[proxy] -> GET https://${SAM_HOST}${options.path}`);
  const upstream = https.request(options, (up) => {
    const chunks = [];
    up.on("data", (c) => chunks.push(c));
    up.on("end", () => {
      const body = Buffer.concat(chunks);
      let summary = "";
      try {
        const j = JSON.parse(body.toString());
        const results = j?._embedded?.results || j?.results || [];
        const total = j?.page?.totalElements ?? j?.totalRecords ?? results.length;
        summary = `total=${total} returned=${results.length}`;
      } catch { summary = `(${body.length} bytes, non-JSON)`; }
      console.log(`[proxy] <- ${up.statusCode} ${summary}`);
      res.writeHead(up.statusCode || 502, {
        "Content-Type": up.headers["content-type"] || "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(body);
    });
  });
  upstream.on("error", (e) => {
    res.writeHead(502, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ error: "Upstream error", detail: e.message }));
  });
  upstream.end();
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/sam")) return proxySam(req, res);
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`\n  SAM.gov tracker running:  http://localhost:${PORT}`);
  console.log(`  Upstream:  https://${SAM_HOST}${SAM_PATH}\n`);
});
