# Driving school website (Angular, prerendered, Cloudflare Pages + Supabase)

Status: STAGE 1 (scaffold, design system, public pages), redesigned in a premium automotive style.
Files were written without running npm or ng. NOTHING HAS BEEN BUILT OR TESTED YET.

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
