# Visit analytics & Telegram notifications

Private, consent-gated visit intelligence for franaragondev.com: a short Telegram
message per engaged visit, and a weekly digest every Monday.

## Architecture

```
Browser (only after "Accept" in the cookie banner)
  AnalyticsTracker ─ route changes, section views, link clicks, tab visibility
  └─ sessionStorage "fa-visit"  (random session id, cleared when the tab closes)
      └─ sendBeacon → POST /api/analytics/visit   (cumulative session state)

/api/analytics/visit (Node, Vercel)
  validate → drop bots → rate limit → lock session → merge with stored state
  → weekly counters (HINCRBY) in Upstash Redis → after(): Telegram sendMessage

Vercel Cron  "0 6 * * 1"  → GET /api/cron/weekly-digest  (Bearer CRON_SECRET)
  previous complete week + the week before → digest → Telegram (idempotent)
```

- **Existing analytics are untouched.** GA4 (`G-MGGZV5VBEV`), Vercel Analytics and
  Speed Insights still load exactly as before, after consent. Tracked sections and
  events are also forwarded to GA4 (`section_view`, `contact_submit`, …) when gtag is present.
- **Why Redis:** serverless functions share no memory, and sessionization, duplicate-beacon
  protection, rate limiting, the weekly counters and the "send the digest only once" guarantee
  all need shared state. Upstash is the smallest option native to Vercel (Marketplace,
  free tier) and is called over REST with `fetch`, so it adds no dependency.
- **Visits** = one browser tab session, ending after 30 minutes of inactivity. The
  browser sends cumulative state when the tab is hidden or closed, and right away on a conversion.
  The server stores only the deltas, so repeated or retried beacons never double count.
- **Notification rule:** a visit is reported once it becomes *engaged*: ≥ 10 s of active
  time, ≥ 2 page views, or any conversion (the same definition as GA4). A conversion that
  happens after that notification triggers a short follow-up (at most 3 per session).
  Global cap: 30 notifications per hour.

## What is tracked

| Kind | Values |
| --- | --- |
| Routes | Home, Baguira case study, Privacy, Cookies, Other (+ site language) |
| Sections | `#expertise`, `#about`, `#projects`, `#partnerships`, `#experience`, `#contact`, and the five Baguira case-study sections (`data-analytics-section`) |
| Events | contact form submitted (only after a successful API response), CV opened, WhatsApp / LinkedIn / GitHub / X / Instagram clicks, project links (HomeStocker, CD Estepona, Baguira Suites), mailto/tel, other outbound |
| Server-derived | country + region (Vercel `x-vercel-ip-country[-region]` headers), device / OS / browser category from the user agent, acquisition channel |

A section counts as viewed after it has been sufficiently visible for 1 second: at least
half of the section, or 40% of the viewport for tall sections. It is counted once per session.
The catalog of everything that can be reported lives in `src/lib/analytics/catalog.ts`. The
endpoint rejects any value not listed there, so a forged request cannot put arbitrary text
into Telegram.

### Acquisition

Order of precedence: UTM tags → **Campaign**; referrer domain → **Organic search** (Google,
Bing, DuckDuckGo, Seznam, …), **AI assistant** (ChatGPT, Perplexity, Claude, Gemini,
Copilot), **Social** (LinkedIn, X, Facebook, …) or **Referral**. With no referrer, a LinkedIn,
Facebook or Instagram in-app browser signature gives **Social**, labelled as having no referrer.
Anything else is **Direct / no referrer**. That label covers typed URLs, bookmarks, apps and
referrers stripped by browser privacy settings, which cannot be told apart. A session
restarted in a stale tab is **Unknown**. Only the referrer *hostname* ever leaves the browser.

## Privacy & retention

- Nothing runs, and nothing is written to storage, until the visitor clicks *Accept*. A
  declined or missing choice means no tracker, no beacon and no GA.
- No cookies of its own, no fingerprinting, no cross-session identifier. Unique visitors are
  therefore **not** measured, and the digest says so.
- The IP address is never stored. It is hashed with a server secret and the current date,
  and used only as a rate-limit key that expires after 10 minutes. The user agent is reduced
  to coarse categories. The raw string is not stored.
- Retention: per-session state **6 h**; weekly aggregate counters **120 days**; digest
  delivery record 90 days. Telegram messages stay in the chat until deleted.
- Geolocation comes from Vercel's IP database. Country is usually right, but VPNs, corporate
  proxies, iCloud Private Relay and mobile carriers can place visitors in the wrong country.
  Region is less reliable. City is deliberately not used.
- The privacy and cookie policies (EN/ES/FR) were updated to describe this. **Have them
  reviewed:** the legal bases and the GA4 retention value are assumptions.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | yes | Injected automatically by the Upstash integration. The legacy `KV_REST_API_URL` / `KV_REST_API_TOKEN` names also work. |
| `TELEGRAM_BOT_TOKEN` | yes | FatherBot's token (same convention as the other projects). |
| `TELEGRAM_CHAT_ID` | yes | Destination chat (your private chat with the bot, or a group/channel id). |
| `CRON_SECRET` | yes | Random string. Vercel Cron sends it as `Authorization: Bearer …`. |
| `ANALYTICS_TIMEZONE` | no | IANA zone for weeks and timestamps. Default `Europe/Prague`. |

Missing configuration degrades safely. Without Redis the endpoint accepts and discards
beacons. Without Telegram, stats are still recorded. Without `CRON_SECRET` the digest
endpoint returns 503.

### Setup steps

1. **Redis:** Vercel → project *franaragondev* → Storage → Marketplace → *Upstash for
   Redis* → create (free) and connect to Production (and Preview if wanted).
2. **Chat id:** open FatherBot in Telegram and send it any message. Then, locally (this does
   not change the bot's configuration):
   `curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" | jq '.result[].message.chat'`
   If another app already consumes FatherBot's updates through a webhook, `getUpdates`
   returns an error. In that case take the chat id from that app's config or logs, or add
   the bot to a group and use that group's id. This feature only calls `sendMessage`, so
   existing integrations are unaffected.
3. Add the env vars:
   `vercel env add TELEGRAM_BOT_TOKEN production --project franaragondev` (and likewise
   `TELEGRAM_CHAT_ID`, `CRON_SECRET`; generate the secret with `openssl rand -hex 32`).
4. Deploy. `vercel.json` registers the cron job. Cron runs only on production deployments.

## Schedule

`0 6 * * 1` = Monday 06:00 UTC (07:00 CET / 08:00 CEST). Each run reports the previous
complete Monday–Sunday week in `ANALYTICS_TIMEZONE`, compared with the week before. Weeks are
bucketed by the local date of the session's first beacon, so DST changes never move a boundary.
Week-over-week figures are shown only when the previous week had ≥ 10 sessions, and pattern
insights only when the current week has ≥ 10.

Duplicate protection: a record `fa:digest:<week>` marks the week as sent, a 5-minute
lock prevents overlapping runs, and a failed multi-message send resumes after the last part
that was delivered. Vercel does not retry failed cron runs. Re-run manually (safe to repeat):

```sh
curl -H "Authorization: Bearer $CRON_SECRET" https://www.franaragondev.com/api/cron/weekly-digest
# preview without sending:              …/api/cron/weekly-digest?dryRun=1
# a specific completed week (Monday):   …/api/cron/weekly-digest?week=2026-10-12&dryRun=1
```

## Verifying

- **Visit notification:** open the production site in a private window, accept cookies,
  stay more than 10 s or open a second page, then switch tabs or close the window. A message
  should arrive within seconds. Check the Vercel function logs for `[analytics]` lines if it
  does not.
- **Digest:** after the first full week, run the `dryRun=1` command above to see the text.
  The first real digest arrives the following Monday. The cron run is visible under
  Vercel → Settings → Cron Jobs.
- **Tests:** `npm test` (vitest), `npm run type-check`, `npm run build`.

## Limitations

- Only visitors who accept analytics are counted, so the totals are a sample.
- Bots that execute JavaScript and accept the banner while spoofing a browser user agent
  cannot be fully excluded.
- Engagement is the time the tab was visible, not proof of attention.
- On mobile, a notification can be sent when the tab is first backgrounded. Later page views
  of that session update the digest, but only conversions produce a follow-up message.
- The endpoint is public, which a beacon has to be. It is protected by validation,
  same-origin checks, rate limits and the notification cap, not by authentication.
