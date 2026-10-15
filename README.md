# Sunrise News

English and Telugu news website with a private newsroom CMS, built with Next.js, React and Tailwind CSS.

## Newsroom features

- Owner login with signed, expiring HttpOnly cookies and persistent login throttling.
- Article drafts, review, approval, publishing and archiving; bilingual content, tags, SEO fields, internal notes and revision restores.
- Saved categories, tags, advertising placements and breaking-news ticker settings.
- Image and document uploads (PDF, DOCX, TXT, MD, JPG, PNG and WebP, maximum 4 MB), with text extraction when supported.
- Private subscriber list and audit history. Newsletter signup records subscriptions; sending email editions requires a separate email delivery service.
- Published articles appear in public pages, search and XML sitemaps. Drafts, private notes, revisions and unreferenced uploads require administrator access.

The owner can enroll employees at `/admin/employees` with a name, email and password of at least 12 characters. Employees sign in at `/admin/login` with Editor access to the existing CMS tools (including publishing, uploads, website settings and subscriber records). Only the owner can view the employee directory, enroll employees or remove access. Employee passwords use salted scrypt hashes in private persistent storage. Removal revokes existing employee sessions and retains articles and historical records; re-enrollment creates a new account without restoring old sessions. New and existing employees automatically appear in Assigned Author. The owner can upload an optional JPG, PNG or WebP profile photo (up to 4 MB) during enrollment, or add/change it in the employee directory. Published articles display that author's photo; login emails and credential hashes are never included in public author profiles. Removing CMS access preserves historical bylines and photos. Comments and online contact submissions are unavailable; the contact page provides the configured newsroom contact details. The e-paper view presents published web stories.

## Local development

Use Node.js 22 LTS.

```sh
npm ci
npm run dev
```

Create `.env.local` (ignored by Git) with your own credentials:

```dotenv
SUNRISE_STORAGE=local
ADMIN_EMAIL=your-owner-email@example.com
ADMIN_PASSWORD=replace-with-a-unique-password-at-least-12-characters
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Open `http://localhost:3000/en` or `http://localhost:3000/te`; the CMS is at `/admin/login`. There are no demo credentials or role-selection shortcuts. Never commit real passwords.

Local data is stored in `data/sunrise_news.json`. Private authentication state is in `data/.cms-store`, and uploads are in `data/media`. Set `SUNRISE_DATA_DIR` to a separate directory when testing. The session signing key is generated cryptographically once and saved in private storage. An optional `SESSION_SECRET` of at least 32 characters overrides it. Changing the owner email/password or signing key invalidates existing sessions.

```sh
npm test
npm run build
npm start
```

## Cloudflare Workers deployment

The Cloudflare target uses the OpenNext adapter and a private SQLite-backed Durable Object binding named `CMS_DATA`. Articles, account hashes, signing keys, login limits and media persist across deployments. Conditional writes are transactional; files are chunked internally to support the existing 4 MB upload limit. No public storage endpoint is exposed. This storage layout is intended for a small newsroom.

Cloudflare Workers Builds can run `npm run build:cloudflare` as the build command and `npm run deploy:cloudflare` as the production deploy command. Pull request previews use `npx wrangler preview`; `wrangler.jsonc` includes its required `previews` configuration and a custom build command. Use Node.js 22. Run `npm run test:cloudflare` to check storage in the actual Worker runtime, and `npm run preview:cloudflare` after building for local Worker previews.

Set `ADMIN_EMAIL` and secret `ADMIN_PASSWORD` (at least 12 characters) on the Worker before using the CMS. Set `NEXT_PUBLIC_SITE_URL` to the intended Cloudflare site URL in the build environment. `SUNRISE_STORAGE=cloudflare` is configured in Wrangler; do not override it with `local` or `netlify` on this target. Preview resources must remain isolated from production accounts and content. The CMS fails closed when owner credentials are missing.

Deploying this code does not copy the current Netlify Blobs data. Before a production cutover, back up and transfer the live database, employee registry, signing key and media from Netlify, verify article counts and uploaded editions, and sign in with both an owner and an employee. Keep Netlify serving production until that transfer and the Cloudflare preview checks are complete. Do not replace live data with the tracked seed snapshot.

PDF text extraction uses the serverless `unpdf` parser without native canvas modules. Automatic extraction is limited to 100 pages; larger or scanned PDFs can still be uploaded and their article text entered manually.

## Netlify deployment (existing host)

Import this GitHub repository into Netlify. `netlify.toml` sets the build command, publish directory and Node version. Netlify's Next.js adapter provides the server runtime.

Set these project environment variables for the **Production** deploy context, including the Functions scope:

| Key | Value |
| --- | --- |
| `SUNRISE_STORAGE` | `netlify` |
| `NEXT_PUBLIC_SITE_URL` | Your HTTPS public site URL |
| `ADMIN_EMAIL` | Your owner login email |
| `ADMIN_PASSWORD` | Your unique password, at least 12 characters; mark as secret |

Redeploy after changing environment variables. Keep administrator credentials out of untrusted preview contexts. The CMS refuses login when credentials are missing.

Netlify Blobs stores the CMS database, private signing key, login limits and uploaded files across function restarts and deployments. It uses site-wide stores, strong reads and conditional writes to prevent concurrent updates from silently overwriting each other. No separate database account or storage API key is needed on Netlify. The tracked `data/sunrise_news.json` snapshot seeds an empty store; later deployments do not replace saved CMS content.

Back up production Blobs content and media before deleting or moving the Netlify project. Local edits to `data/sunrise_news.json` do not update an already initialized production store. This JSON store is intended for a small newsroom; large content collections or heavy concurrent traffic warrant a database migration.

Netlify's Free plan has usage limits. Check the account's usage dashboard; free hosting does not guarantee unlimited traffic or uninterrupted service after its allowance is exhausted. This application does not enable paid upgrades.

## Dependency maintenance

Next.js is updated to 15.5.27 with React 19. The Next.js PostCSS dependency is overridden to 8.5.29 for security fixes. The deployment audit has no high or critical production dependency findings. Three related moderate notices remain for mammoth/argparse/sprintf-js in the unused DOCX command-line dependency chain; the web application uses the mammoth library and does not load that CLI. Recheck npm audit when updating packages.
