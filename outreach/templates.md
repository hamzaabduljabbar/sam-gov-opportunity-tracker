# Outreach Templates — SAM.gov Tracker Lead Magnet

All templates use merge fields in `{{double_braces}}` matching the columns in [`leads-template.csv`](leads-template.csv).

**Required fields:** `first_name`, `firm`, `federal_signal`, `slug`
**Optional:** `city`, `naics_guess`

**Base URL:** `https://YOUR-DEPLOYED-URL.vercel.app` — replace once, everywhere.

---

## CONNECTION REQUEST NOTE (under 300 chars)

Use for: 1st- and 2nd-degree prospects. Always lead with this.

```
Hi {{first_name}} — saw {{firm}} {{federal_signal}}. Nice. I build automation for GCs bidding federal. Just shipped a free SAM.gov tracker that auto-scores new opps against your NAICS — figured it might save your team some refresh-clicking. Open to connect?
```

**Char count tip:** the `federal_signal` field is what blows the limit. Keep it short — "won the USACE bridge job", "the VA renovation", "your DoD past performance". Aim for 6–10 words.

---

## MESSAGE #1 — after they accept (same day)

```
Thanks for connecting, {{first_name}}.

Here's the tool — no signup, just open it:

https://YOUR-DEPLOYED-URL.vercel.app?ref={{slug}}

Drop your NAICS + a one-paragraph company description in the left "My Profile" panel. It scores every new SAM.gov post 0–100% match and the "Prepare Bid" button auto-fills a draft addressed to the contracting officer.

Built it after watching a GC client miss a $2M solicitation because they were manually refreshing SAM.gov. Curious what you think.
```

---

## FOLLOW-UP #1 — 5 days after Message #1, no reply

Not a pitch — a feedback ask. Much higher reply rate.

```
Quick one, {{first_name}} — if you opened the tracker, what did you wish it did differently? Building the next version this month and gathering real-bidder feedback.
```

---

## FOLLOW-UP #2 — 10 days after Follow-up #1, no reply

Last touch. Soft ask for the call.

```
Last note from me on this, {{first_name}} — if SAM.gov triage is on your roadmap this quarter, happy to walk you through how some GCs are wiring this into their CRM. 15 min: https://calendly.com/hamzajabbar167/free-one-on-one-consultation-call-6

Either way, the tool's free and yours: https://YOUR-DEPLOYED-URL.vercel.app?ref={{slug}}
```

---

## INMAIL — for 3rd-degree or "no accept after 10 days"

DIFFERENT angle from the connect note. Lead with a question, not a pitch.

**Subject:** `Quick question for {{firm}} — not a pitch`

```
Hi {{first_name}} —

{{firm}} keeps showing up when I review winners in federal construction. Genuinely curious: how are you currently triaging new SAM.gov posts? Manual refresh, paid service (GovWin / EZGovOpps), or a VA?

Not selling anything. Researching what federal-bidding GCs actually use.

I built a free tool myself ({{base_url}}?ref={{slug}}) — would value 2 minutes of your reaction to it if you're open.

— Hamza
```

---

## "HOT LEAD" RESPONSE — when Vercel logs show prepare_bid or cta_click

Same day, fast. They've shown intent.

```
Hey {{first_name}} — noticed someone from {{firm}} was poking around the tracker. Anything that stood out, or anything you wished worked differently? Genuinely just curious — feedback shapes v2.
```

(Don't mention the analytics tech. Just say "noticed" — feels natural.)

---

## Google Sheets formulas to auto-generate from your CSV

Paste the CSV into a Google Sheet. Add these columns:

**Column R — Tagged URL:**
```
="https://YOUR-DEPLOYED-URL.vercel.app?ref="&A2
```

**Column S — Connect note:**
```
="Hi "&C2&" — saw "&B2&" "&I2&". Nice. I build automation for GCs bidding federal. Just shipped a free SAM.gov tracker that auto-scores new opps against your NAICS — figured it might save your team some refresh-clicking. Open to connect?"
```

**Column T — Char count check (must be ≤ 300):**
```
=LEN(S2)
```
Conditional-format red if > 300.

**Column U — Message #1:**
```
="Thanks for connecting, "&C2&". Here's the tool — no signup, just open it: "&R2&"  Drop your NAICS + a one-paragraph company description in the 'My Profile' panel. It scores every new SAM.gov post 0–100% match and 'Prepare Bid' auto-fills a draft to the contracting officer. Built it after watching a GC client miss a $2M solicitation. Curious what you think."
```

**Column V — InMail body:**
```
="Hi "&C2&" — "&B2&" keeps showing up when I review winners in federal construction. Genuinely curious: how are you currently triaging new SAM.gov posts? Manual refresh, paid service (GovWin / EZGovOpps), or a VA? Not selling anything — researching what federal-bidding GCs actually use. I built a free tool myself ("&R2&") — would value 2 minutes of your reaction to it if you're open. — Hamza"
```

Now every row in the sheet auto-builds its own personalized messages. Copy → paste into LinkedIn.

---

## Sequencing rules (with 100 InMails)

| Tier | Who | Channel | Cadence |
|---|---|---|---|
| **A — Top 50 dream GCs** | ENR Top 400, $50M+ rev, strong federal past performance | **Connect first** (free). InMail only if no accept after 10d. | 5–7 connects/day |
| **B — Mid-market 50–500 leads** | $5–50M GCs, federal-listed | **Connect** with note. No InMail rescue (preserve credits). | 10/day |
| **C — Out-of-network "moonshots"** | Can't see profile / 3rd+ degree / restricted | **InMail direct.** ~20 of these. | 3–4/week |
| **D — Best-fit Vercel-log clickers** | Anyone who fires `prepare_bid` or `cta_click` | "Hot lead" follow-up same day. | As they fire. |

**Daily routine (~30 min):**
1. **Morning (10 min):** Send 10–15 connects from Tier B. Send 2–3 InMails to Tier A no-accepts.
2. **Check Vercel logs** for new `prepare_bid` / `cta_click` events. Send hot-lead message to anyone who hit them in the last 24h.
3. **Process inbox:** reply to accepts with Message #1, move sheet rows to next status.
4. **End of week:** export sheet, calculate accept rate, click rate, reply rate. Adjust copy on the worst-performing message.

Target conversion math (industry-typical):
- 100 connects sent → 40–60 accepts → 20–30 read Message #1 → 5–10 click tool → 1–3 book a call.
- 17 InMails/week → 3–5 replies → 1–2 of those click the tool.

If you're under these numbers after 2 weeks, the bottleneck is targeting (Sales Nav filter too broad) or `federal_signal` (too generic). Revisit those, not the message.
