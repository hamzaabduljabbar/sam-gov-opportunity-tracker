exports.handler = async (event) => {
  const rawId = (event.queryStringParameters && event.queryStringParameters.id) || "";
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: "missing id" }) };

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
    return {
      statusCode: r.status,
      headers: {
        "Content-Type": r.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
      body,
    };
  } catch (e) {
    return { statusCode: 502, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Upstream error", detail: String(e?.message || e) }) };
  }
};
