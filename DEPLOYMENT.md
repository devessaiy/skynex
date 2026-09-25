# Deploying the multi-page site

The site is now a standard multi-page website: every page is its own real HTML file, and every
link is an ordinary link to that file. There is no client-side router and no "serve index.html
for everything" fallback any more — the old SPA rewrite rules are no longer needed (and should be
removed if you added them).

| URL | File |
|---|---|
| `/` | `index.html` |
| `/services` `/team` `/contact` `/careers` `/news` | `services.html` … `news.html` |
| `/privacy-policy` `/terms-of-service` `/legal` `/sitemap` | matching `.html` files |
| `/staff/login` `/staff/reset-password` `/staff/dashboard` | `staff/login.html` … |
| anything else | `404.html` |

The links keep their clean look (`/team`, not `/team.html`). Most hosts do that automatically;
a couple need one setting. Find yours:

## Netlify, Cloudflare Pages, GitHub Pages
Nothing to configure. They serve `team.html` at `/team` and use `404.html` for unknown pages.

## Vercel
`vercel.json` (included): `{ "cleanUrls": true }`

## Apache (cPanel, most shared hosting)
`.htaccess` (included) maps `/team` to `team.html` and sets `404.html`.

## Nginx
```nginx
location / {
  try_files $uri $uri.html $uri/ =404;
}
error_page 404 /404.html;
```

## Firebase Hosting
In `firebase.json`: `{ "hosting": { "cleanUrls": true } }`

## AWS S3 / CloudFront, IIS
These don't map extensionless URLs to `.html` on their own. Tell me which you use and I'll give
you the exact rule. (S3: set the error document to `404.html`.)

**Local testing:** open the site through a local web server (not by double-clicking a file).
A plain static server will show `/team.html`-style URLs working but not `/team` unless it
supports clean URLs (e.g. `npx serve` does).

---

# Supabase Auth: one required setting for the Staff Portal

`/staff/reset-password` must open at exactly that clean URL (see the hosting section above),
otherwise the emailed reset link lands on a 404.

However, Supabase Auth will refuse the password-reset redirect until you allow-list it:

1. In the Supabase dashboard, go to **Authentication → URL Configuration** for the `skynex`
   project.
2. Set **Site URL** to your real deployed domain (e.g. `https://skynex.com.ng`).
3. Add `https://<your-domain>/staff/reset-password` (and, for local testing,
   `http://localhost:<port>/staff/reset-password`) to **Redirect URLs**.

Founder accounts are also created from this dashboard: **Authentication → Users → Invite
user**, then assign that person's role by running one SQL statement in the SQL Editor:

```sql
update public.profiles set role_code = 'ceo' where email = 'name@company.com';
```

(`role_code` is one of: `ceo`, `cto`, `coo`, `cfo`, `cmo`, `rnd`.)

---

**Not sure which of these applies, or your host isn't listed?** Tell me what you're deploying with
(the platform name, or how you currently upload/push the site) and I'll give you the exact config.

---

## Phase 2 backend (applied to the `skynex` Supabase project)

- **New tables:** `news_posts`, `leadership_members` (both RLS-protected; public read of only
  live/active rows, writes gated by the existing `role_permissions` table via `manage_news` /
  `manage_leadership`, added as two new permission codes -- no new RBAC system).
- **New Storage buckets:** `news-media`, `team-photos` (both public-read; staff write, checked by
  the same two permissions).
- **7-day news cleanup:** an Edge Function (`cleanup-expired-news`) deletes expired posts and
  their Storage files together, run hourly by `pg_cron` + `pg_net` -- entirely inside Supabase, no
  dependency on a visitor opening the site.
- **Contact replies:** the dashboard's Reply button opens a `mailto:` link to the visitor's email
  in the staff member's own mail client. No email-sending service is configured; if you want
  replies logged in-app later, that needs an email API (e.g. Resend, Postmark) added as a Supabase
  secret.
- **Leadership photos:** `leadership_members.photo_path` starts empty for every seeded member.
  A placeholder avatar is shown publicly until a real photo is uploaded from
  `/staff/leadership` (CEO only). Uploaded photos are compressed to WebP in the browser first.

---

## Ads (Google AdSense, News page only)

Ads are wired up but **off by default** -- nothing renders and no ad script loads until you
finish AdSense setup. To turn them on:

1. Get approved for Google AdSense (adsense.google.com) and create one "Display ad" unit.
2. Open `js/config-ads.js` and set `enabled: true`, your Publisher ID (`client`), and the Ad
   Slot ID for the unit you created (`slots.newsListTop` -- you can reuse the same slot ID for
   all three, or create separate units for each).
3. Replace the placeholder line in `ads.txt` with the real line AdSense's dashboard gives you
   (Sites -> your domain -> "Do it yourself").

Ads only ever appear on `/news` (one banner above the list, one every 4 posts in the feed) and on
an individual `/news-post` page (one unit below the article). No other page loads the ad script
or any ad-related code.
