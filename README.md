# SAM.gov Opportunity Tracker

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hamzaabduljabbar/sam-gov-opportunity-tracker)

A lightweight dashboard for **general contractors** to monitor [SAM.gov](https://sam.gov) for new federal contract opportunities the moment they're posted — filter by NAICS, notice type, set-aside, and place of performance; score each opportunity against your company profile; and prep a bid draft pre-filled with the contract's details.

## Features

- **Live SAM.gov feed** — queries the same internal endpoint the SAM.gov website itself uses (`sam.gov/api/prod/sgs/v1/search`). No API key required.
- **Time filtering** — "Last 24 hours" toggle (primary use case) or custom posted-date range.
- **Multi-select filters** — all 9 SAM notice types, 28 general-contracting NAICS codes (plus free-text "additional NAICS"), keyword title search, set-aside type, place-of-performance state, active-only.
- **Inline project descriptions** — pulled straight from SAM.gov; no need to click through.
- **Match score (0-100%)** — describe your company once in the **My Profile** panel; every opportunity gets scored against it. Sort by best match to surface the right contracts.
- **🔥 New badge** for anything posted in the last 6 hours.
- **Response-deadline countdown** with urgent highlighting.
- **Contracting officer contact** surfaced on every card.
- **Prepare Bid modal** — upload your own `{{placeholder}}` bid template (or use the built-in one), watch it auto-fill with the opportunity's data, then **Copy / Download .txt / Email to Contracting Officer** (opens your mail client pre-populated).
- **All settings persist** in browser localStorage — profile, filters, and bid template survive refreshes.

> ℹ **About bid submission:** SAM.gov does not expose a public bid-submission API. The "Email to Contracting Officer" button opens your mail client with the filled bid as the body so you can attach any required forms and send. Direct in-app submission is not technically possible.

## Tech stack

- **Frontend:** React 18 (via CDN) + Tailwind (via CDN) + Babel Standalone. Single self-contained `index.html` — no build step.
- **Backend:** ~90 lines of plain Node.js (no framework, no deps). Serves the static page and proxies requests to `sam.gov` (necessary because SAM.gov's internal endpoint blocks browser CORS).
- **Zero npm dependencies.** `npm install` is unnecessary.

## Quick start

```bash
git clone <your-fork-url>
cd sam-tracker
node server.js
```

Then open <http://localhost:5188>.

That's it — no build, no install, no key.

### Change the port

```bash
PORT=8080 node server.js
```

## Deploy publicly (free)

The repo is **Vercel-ready** — the proxy lives as a serverless function at [`api/sam.js`](api/sam.js) and `index.html` is served as the homepage.

**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hamzaabduljabbar/sam-gov-opportunity-tracker)

**Or via Vercel dashboard:**

1. Sign in at <https://vercel.com> with your GitHub account.
2. Click **Add New → Project**, pick `sam-gov-opportunity-tracker`.
3. Leave all settings at default and click **Deploy**.
4. ~30 seconds later you'll get a URL like `https://sam-gov-opportunity-tracker.vercel.app`.
5. Every `git push` to `main` redeploys automatically.

You can also attach a custom domain (e.g. `bids.yourcompany.com`) from the Vercel project settings — free.

### Or deploy on Netlify

The repo also includes [`netlify.toml`](netlify.toml) and a Netlify Function at [`netlify/functions/sam.js`](netlify/functions/sam.js).

1. <https://app.netlify.com/start> → **Import from Git** → pick this repo.
2. Leave build settings at default (they're auto-detected from `netlify.toml`).
3. Click **Deploy site** → you get `https://<random>.netlify.app`.
4. Rename or attach a subdomain (e.g. `bids.yourdomain.com`) from **Site settings → Domain management**.

Both deploys can run side-by-side; pick whichever fits your existing workflow.

## Customize the lead-gen banner

The top banner is for outreach / lead generation. To edit your name, tagline, CTA text, or contact link, open `index.html` and modify the `BRAND` block near the top of the `<script>` tag:

```js
const BRAND = {
  name:    "Your Name",
  tagline: "I build automation tools like this for businesses.",
  cta:     "Need a custom build? Let's talk →",
  url:     "mailto:you@example.com",
  show:    true,   // false to hide the banner
};
```

## Project structure

```
sam-tracker/
├── index.html      # Single-file React app (UI, API client, matching, bid prep)
├── server.js       # Static server + transparent proxy to sam.gov
├── package.json    # Metadata only — no runtime dependencies
├── LICENSE
└── README.md
```

## How it works

```
   Browser  ──fetch──▶  http://localhost:5188/api/sam?<query>
                                   │
                                   ▼  (Node proxy adds browser-like headers)
                       https://sam.gov/api/prod/sgs/v1/search?<query>
```

The proxy exists solely to bypass CORS. It does **not** transform requests or responses — query parameters and JSON are forwarded as-is.

### Match scoring algorithm

For each opportunity, the client tokenizes your profile description + keywords (dropping stopwords), then scans the opportunity for hits:

| Field where token appears | Weight |
|---|---|
| Title                     | ×3 |
| Agency / office           | ×2 |
| Description / set-aside   | ×1 |
| **NAICS prefix match**    | +10 flat bonus |

Final score is `(hits / max-possible) × 100`, rounded.

### Bid template placeholders

The built-in template uses these placeholders, all of which are auto-filled from the opportunity:

```
{{title}} {{solicitationNumber}} {{noticeId}} {{agency}} {{naics}}
{{setAside}} {{postedDate}} {{deadline}} {{officerName}} {{officerEmail}}
{{samLink}} {{description}} {{placeOfPerformance}}
```

Upload your own `.txt` template using the same syntax — the modal will fill it on the fly.

## Roadmap ideas

- Save/star opportunities and track bid status (Draft → Submitted → Won/Lost)
- `.docx` template support via `docxtemplater`
- Email digest (cron) of new 🔥 matches above a score threshold
- Multi-user profiles for firms with multiple bidding teams

## License

MIT — see [LICENSE](LICENSE).
