// Vercel serverless function: lightweight event tracker.
// Pixel-style endpoint that logs { ref, event, meta } to function logs.
// View in: Vercel dashboard → your project → Logs → filter by "[track]"

module.exports = async (req, res) => {
  const url = new URL(req.url, "http://x");
  const ref   = url.searchParams.get("ref")   || "unknown";
  const event = url.searchParams.get("event") || "view";
  const meta  = url.searchParams.get("meta")  || "";
  const ua    = req.headers["user-agent"] || "";
  const ip    = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";
  const ts    = new Date().toISOString();

  // One-line structured log — easy to grep in dashboards
  console.log(`[track] ts=${ts} ref=${ref} event=${event} meta=${JSON.stringify(meta)} ip=${ip} ua=${JSON.stringify(ua.slice(0,80))}`);

  // 1x1 transparent gif so the call works as <img src=...> too
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "image/gif");
  res.status(204).end();
};
