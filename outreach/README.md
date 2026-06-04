# Outreach Kit

Everything you need to run the LinkedIn campaign for the SAM.gov Tracker lead magnet.

## Files

| File | What it is |
|---|---|
| [`leads-template.csv`](leads-template.csv) | Empty sheet structure with 3 example rows. Import to Google Sheets. |
| [`templates.md`](templates.md) | Connection note, follow-ups, InMail copy, and Google Sheets formulas to auto-generate per-prospect messages. |

## Workflow

1. **Run the Sales Nav search** (see filters in main project README / chat history).
2. **Add prospects to the sheet** as you go — one row per lead. The `connector` you mentioned can populate the firmographic columns (firm, name, title, city/state, LinkedIn URL).
3. **Fill `federal_signal` manually** — one short fact from their site/profile proving they bid federal. This is the personalization. Don't skip it.
4. **Set `slug`** — lowercase-hyphenated firm name. This becomes their tracking tag.
5. **Set `channel`** to `connect` (Tier A/B) or `inmail` (Tier C).
6. **Use the Sheets formulas** in `templates.md` to auto-generate the tagged URL + ready-to-paste message in new columns.
7. **Send. Update status column.** Watch Vercel/Netlify logs for the `[track]` events.

## Status values (column L)

`not_sent` → `connect_sent` → `accepted` → `msg1_sent` → `clicked` → `replied` → `booked` → `won` / `lost` / `nurture`

For InMail track: `not_sent` → `inmail_sent` → `replied` → `clicked` → `booked` etc.

## What "good" looks like after week 1

- **Connection accept rate:** ≥ 40% (if lower, the connect note or targeting is off)
- **Message #1 → tool click:** ≥ 30% (if lower, the message is too pitchy)
- **Tool click → CTA click (`cta_click` in logs):** ≥ 10% (if lower, the tool isn't impressing them — debug)
- **CTA click → booked call:** ≥ 30% (Calendly conversion is usually fine; if not, check the Calendly page itself)
