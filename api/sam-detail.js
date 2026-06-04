// Vercel serverless function: fetches a single opportunity's full detail.
// Usage:  /api/sam-detail?id=<noticeId>

module.exports = async (req, res) => {
  const url = new URL(req.url, "http://x");
  const rawId = url.searchParams.get("id") || "";
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) { res.status(400).json({ error: "missing id" }); return; }

  const upstream = `https://sam.gov/api/prod/opps/v2/opportunities/${id}`;
  try {
    const r = await fetch(upstream, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Referer": "https://sam.gov/",
        "Origin": "https://sam.gov",
      },
    });
    const body = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: "Upstream error", detail: String(e?.message || e) });
  }
};
