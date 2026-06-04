// Vercel serverless function: proxies sam.gov's internal search endpoint.
// Same purpose as server.js, but in the shape Vercel expects.
// Deployed automatically at /api/sam when this file lives at /api/sam.js.

module.exports = async (req, res) => {
  const SAM = "https://sam.gov/api/prod/sgs/v1/search";
  const qIdx = req.url.indexOf("?");
  const qs = qIdx >= 0 ? req.url.slice(qIdx) : "";
  const upstream = SAM + qs;

  try {
    const r = await fetch(upstream, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Referer": "https://sam.gov/search/",
        "Origin": "https://sam.gov",
      },
    });
    const body = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=60");
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: "Upstream error", detail: String(e?.message || e) });
  }
};
