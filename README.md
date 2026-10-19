# Driving school website (Angular, prerendered, Cloudflare Pages)

Static Angular site with a premium automotive design. The contact form posts to a Cloudflare Pages Function and sends enquiries through Resend. Submissions are emailed and not stored in a database.

## Run on Ubuntu
    sudo apt install -y git curl
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
    npm install
    npm start            # http://localhost:4200
    npm run build        # output: dist/driving-school/browser

If `npm install` or the build fails (versions or the prerender config in angular.json/src/server.ts were written from memory),
paste the error to me and I will fix it, or generate a fresh project with `npx @angular/cli new` and copy `src/` and `public/` in.

## Configure
Edit `src/app/site.config.ts` (name, phone, WhatsApp, address, hours, map, courses) and the domain in `public/robots.txt`, `public/sitemap.xml`.

### Contact form email
Deploy the site to Cloudflare Pages so `functions/api/contact.ts` is available at `/api/contact`. In the Pages project's **Settings → Variables and Secrets**, add:

- `CONTACT_EMAIL`: the private inbox that should receive enquiries.
- `CONTACT_FROM_EMAIL`: a sender address on a domain verified with Resend.
- `RESEND_API_KEY`: your Resend API key (mark it as a secret).

The recipient and API key stay on the server. The form does not use Supabase or save submissions. For local preview, run the generated static site with the Cloudflare Pages dev tooling and configure the same variables there; plain `ng serve` does not run Pages Functions.

## Source layout (src/app)
    app.component.*            root shell (header, footer, mobile dock, router outlet)
    app.routes.ts              lazy routes to each page component
    core/config/site.config.ts business details (edit this)
    core/services/seo.service.ts  titles, meta, canonical, structured data
    shared/components/         icon, header, footer, mobile-dock (each: .ts/.html/.css)
    pages/<name>/              home, about, courses, gallery, contact, privacy (each: .ts/.html/.css)
Global styles (tokens, buttons, patterns shared by several pages) stay in src/styles.css.
