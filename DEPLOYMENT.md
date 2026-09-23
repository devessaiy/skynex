# Deploying the real URL paths (/team, /careers, /news, …)

The site now uses real URL paths (`/`, `/services`, `/team`, `/contact`, `/careers`, `/news`)
instead of `#hash` fragments. Clicking links inside the site always works, on any host — that part
needs no server configuration.

**Directly loading or refreshing one of those URLs does need one extra setting**, because this is
still a single physical file (`index.html`) with client-side JavaScript deciding what to show. If
someone types `yoursite.com/team` into their browser, or refreshes while on that page, the *server*
sees a request for `/team` and needs to be told "serve index.html for that too" — otherwise it
returns a 404, because no `team.html` file actually exists on disk.

Find your host below and add the matching config. You only need the one that matches where this
site is actually hosted.

## Netlify
Create a file named `_redirects` (no extension) at the same level as `index.html`:
```
/*  /index.html  200
```

## Vercel
Create `vercel.json` at the project root:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Cloudflare Pages
Same as Netlify — add a `_redirects` file:
```
/*  /index.html  200
```

## Apache (cPanel, most shared hosting, self-managed servers)
Create/edit `.htaccess` in the same folder as `index.html`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

## Nginx
Inside the relevant `server { }` block:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Firebase Hosting
In `firebase.json`:
```json
{ "hosting": { "rewrites": [{ "source": "**", "destination": "/index.html" }] } }
```

## AWS S3 (static website hosting) / CloudFront
- **S3 website hosting**: set the bucket's "Error document" to `index.html` (not just the index
  document) in the Static website hosting settings.
- **CloudFront**: add a Custom Error Response for HTTP 404 (and 403, since S3 often returns that
  instead) → Response Page Path `/index.html`, HTTP Response Code `200`.

## IIS (Windows hosting)
Add a `web.config` in the same folder:
```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## GitHub Pages
GitHub Pages can't run server-side rewrites, so it needs a different trick: a `404.html` that
redirects back to `index.html` while preserving the path, plus a small script in `index.html` that
restores it. This is a bigger change than the others above — let me know if this is actually your
host and I'll wire it up properly rather than you hand-rolling it from a snippet.

---

# Supabase Auth: one required setting for the Staff Portal

The `/staff/*` routes above are covered automatically by whichever SPA fallback rule you added
above — no extra rewrite rule is needed for them.

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
