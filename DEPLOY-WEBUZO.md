# Deploying the RAS MUTA Foundation Website to a Webuzo VPS

This guide deploys the site by **cloning from GitHub onto the VPS** and building there. This is the cleanest workflow — future updates are just `git pull && bash scripts/deploy-webuzo.sh`.

---

## 0. What you'll need

| Item | Notes |
|---|---|
| A Webuzo VPS | With root/WHM access and the Webuzo panel installed |
| SSH access to the VPS | Or use Webuzo's built-in Terminal |
| Node.js 18+ available in Webuzo | Webuzo's "Node.js Selector" lets you install it |
| A domain name (optional but recommended) | `rasmutafoundation.org` |
| ~1 GB free RAM | For the production build |

The project uses Next.js **standalone output**, so the production build at `.next/standalone/server.js` is self-contained — no `node_modules` needed at runtime.

---

## 1. One-time VPS setup

### 1a. Install Node.js in Webuzo

1. Log in to **Webuzo panel** (usually `https://YOUR_VPS_IP:20000`).
2. Find **Node.js Selector** (under "Software" or "Advanced").
3. Click **Install Node.js** → choose **Node.js 18 LTS** or newer.

### 1b. Create the addon domain (if using a custom domain)

1. Webuzo panel → **Domains → Addon Domains** → **Add Domain**.
2. **Domain Name**: `rasmutafoundation.org`.
3. **Document Root**: `public_html/rasmuta`.
4. Click **Add Domain**. Webuzo creates the empty `rasmuta` folder.

### 1c. Point your domain's DNS to the VPS

At your domain registrar, set an **A record** pointing `rasmutafoundation.org` to the VPS IP. DNS propagation takes 5 min – 24 hours.

---

## 2. Clone the repo onto the VPS

### Via Webuzo Terminal (easiest):

1. Webuzo panel → **Terminal** (under "Software" or "Advanced").
2. Run:

```bash
cd ~/public_html
git clone https://github.com/lilromeo2290/RasMuta.git rasmuta
cd rasmuta
```

If `rasmuta` already exists (you created the addon domain in step 1b), clone to a temp name and move:

```bash
cd ~/public_html
git clone https://github.com/lilromeo2290/RasMuta.git rasmuta-tmp
mv rasmuta-tmp/* rasmuta-tmp/.* rasmuta/ 2>/dev/null
rm -rf rasmuta-tmp
cd rasmuta
```

### Via SSH:

```bash
ssh YOUR_USERNAME@YOUR_VPS_IP
cd ~/public_html
git clone https://github.com/lilromeo2290/RasMuta.git rasmuta
cd rasmuta
```

---

## 3. Configure the environment

Create your `.env` file from the template:

```bash
cp .env.example .env
nano .env
```

Edit the `DATABASE_URL` line — replace `YOUR_USERNAME` with your actual Webuzo username:

```
DATABASE_URL=file:/home/YOUR_USERNAME/public_html/rasmuta/db/custom.db
NODE_ENV=production
PORT=3000
```

Save (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`).

> ⚠️ **The `DATABASE_URL` MUST be an absolute path with your actual username.** This is the #1 cause of deployment failures.

---

## 4. Install + build

Run the deploy script:

```bash
bash scripts/deploy-webuzo.sh
```

This script:
1. ✅ Verifies Node.js is installed
2. ✅ Runs `npm install` (installs dependencies — 1-2 minutes)
3. ✅ Generates the Prisma client
4. ✅ Runs `npx prisma db push` (creates the SQLite database + tables)
5. ✅ Builds the production standalone bundle (`npm run build` — 1-3 minutes)

⏱️ Total time: 3–5 minutes. When it finishes, you'll see `✅ BUILD COMPLETE`.

---

## 5. Set up the Node.js app in Webuzo

1. Webuzo panel → **Software → Setup Node.js App** (or "Node.js Selector").

2. Click **Create Application**:

   | Field | Value |
   |---|---|
   | **Node.js version** | 18.x or 20.x (highest available) |
   | **Application mode** | Production |
   | **Application root** | `rasmuta` |
   | **Application URL** | `rasmutafoundation.org` |
   | **Application startup file** | `.next/standalone/server.js` |

3. In **Environment variables**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `file:/home/YOUR_USERNAME/public_html/rasmuta/db/custom.db` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |

   *(Must match what's in your `.env` file exactly.)*

4. Click **Create** then **Start App**.

5. Click the **App URL** — your site should load! 🎉

---

## 6. SSL certificate (recommended)

1. Webuzo → **SSL/TLS → Let's Encrypt**.
2. Select your domain → **Issue Certificate**.
3. Wait 30–60 seconds.
4. Your site is now accessible at `https://rasmutafoundation.org` ✨

---

## 7. Updating the site later

Whenever you push new code to GitHub, update the VPS:

```bash
cd ~/public_html/rasmuta
git pull origin main
bash scripts/deploy-webuzo.sh
```

Then in Webuzo → Node.js App → click **Restart App** (or `pm2 restart rasmuta` if using PM2).

---

## 8. (Optional) Run permanently with PM2

If Webuzo's Node.js Selector isn't keeping the app alive, use PM2:

```bash
npm install -g pm2
cd ~/public_html/rasmuta
NODE_ENV=production PORT=3000 pm2 start .next/standalone/server.js --name rasmuta
pm2 save
pm2 startup    # follow the instructions it prints
```

Useful PM2 commands:
```bash
pm2 status              # check if running
pm2 logs rasmuta        # tail logs
pm2 restart rasmuta     # restart after update
pm2 stop rasmuta        # stop
```

---

## 9. Backing up the database

The SQLite database lives at `db/custom.db`. Back it up periodically:

```bash
cp ~/public_html/rasmuta/db/custom.db ~/backups/custom-$(date +%F).db
```

Or set up a cron job via Webuzo → **Cron Jobs**:
```
0 3 * * * cp /home/YOUR_USERNAME/public_html/rasmuta/db/custom.db /home/YOUR_USERNAME/backups/custom-$(date +\%F).db
```

---

## 10. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| **502 Bad Gateway** | Node server not running. Check `pm2 status` or Webuzo's Node.js app status. |
| **500 Internal Server Error** | Check `.env` — most often wrong `DATABASE_URL` path. Run `npx prisma db push` again. |
| **Blank white page** | Static assets not served. Verify `npm run build` finished and `.next/standalone/.next/static/` exists. |
| **EACCES permission denied on db/** | `chmod -R 755 db && chown -R YOUR_USERNAME:YOUR_USERNAME db` |
| **Port 3000 already in use** | Change `PORT=3001` in `.env` and the Node.js app env vars. |
| **Build fails with "out of memory"** | `NODE_OPTIONS="--max-old-space-size=1024" npm run build` |
| **Prisma client not found** | Run `npx prisma generate` again after `npm install`. |
| **App URL shows old content after update** | Webuzo → Node.js App → "Restart App". |
| **Site shows Webuzo default page** | Addon domain Document Root is wrong. Set it to `public_html/rasmuta`. |
| **`git clone` fails** | Check internet access on the VPS: `ping github.com`. Or download a ZIP via File Manager and extract. |

---

## 11. File locations on the VPS

| What | Path |
|---|---|
| Project root | `/home/YOUR_USERNAME/public_html/rasmuta/` |
| Environment file | `/home/YOUR_USERNAME/public_html/rasmuta/.env` |
| SQLite database | `/home/YOUR_USERNAME/public_html/rasmuta/db/custom.db` |
| Production server | `/home/YOUR_USERNAME/public_html/rasmuta/.next/standalone/server.js` |
| Static assets | `/home/YOUR_USERNAME/public_html/rasmuta/.next/standalone/.next/static/` |
| Public uploads | `/home/YOUR_USERNAME/public_html/rasmuta/.next/standalone/public/` |
| Deploy script | `/home/YOUR_USERNAME/public_html/rasmuta/scripts/deploy-webuzo.sh` |

---

## 12. One-line summary

```bash
# On the VPS (via Terminal or SSH):
cd ~/public_html && \
git clone https://github.com/lilromeo2290/RasMuta.git rasmuta && \
cd rasmuta && \
cp .env.example .env && \
nano .env  # edit DATABASE_URL with your username, save and exit
bash scripts/deploy-webuzo.sh
# Then in Webuzo → Node.js App → Create with startup file .next/standalone/server.js
```

You're live. 🚀

---

**Repo:** https://github.com/lilromeo2290/RasMuta
