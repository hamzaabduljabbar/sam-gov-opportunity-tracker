// Netlify Function: proxies sam.gov's internal search endpoint.
// Mapped to /api/sam by the redirect in netlify.toml.

exports.handler = async (event) => {
  const SAM = "https://sam.gov/api/prod/sgs/v1/search";
  const qs = event.rawQuery ? "?" + event.rawQuery : "";
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
    return {
      statusCode: r.status,
      headers: {
        "Content-Type": r.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
      body,
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Upstream error", detail: String(e?.message || e) }),
    };
  }
};
