// Netlify Function: lightweight event tracker.
// Mapped to /api/track by the redirect in netlify.toml.

exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  const ref   = p.ref   || "unknown";
  const ev    = p.event || "view";
  const meta  = p.meta  || "";
  const ua    = (event.headers["user-agent"] || "").slice(0,80);
  const ip    = event.headers["x-forwarded-for"] || "";
  const ts    = new Date().toISOString();

  console.log(`[track] ts=${ts} ref=${ref} event=${ev} meta=${JSON.stringify(meta)} ip=${ip} ua=${JSON.stringify(ua)}`);

  return {
    statusCode: 204,
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "image/gif",
    },
    body: "",
  };
};
