#!/usr/bin/env bash
# deploy-webuzo.sh — run ONCE on the Webuzo VPS after cloning the repo.
#
# This script builds the project from source on the VPS:
#   1. Installs Node.js dependencies (npm install)
#   2. Generates the Prisma client
#   3. Creates the SQLite database and applies the schema
#   4. Builds the Next.js production bundle (standalone output)
#
# After this script finishes, you start the app from the Webuzo panel
# (Node.js app → Start) pointing at .next/standalone/server.js
#
# Requirements on the VPS (Webuzo provides most of these):
#   - Node.js 18+ (Webuzo's "Node.js Selector" or "Setup Node.js App")
#   - npm
#   - Bash
#   - ~1GB free RAM for the build
#
# Usage:
#   cd ~/public_html/rasmuta       # wherever you cloned the repo
#   bash scripts/deploy-webuzo.sh

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "=== Webuzo deployment starting in: $PROJECT_DIR ==="
echo ""

# 1. Node version check
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed or not on PATH."
  echo "   In Webuzo: open the panel → Node.js Selector → Install Node.js 18+"
  echo "   Then re-run this script."
  exit 1
fi
echo "✅ Node.js: $(node -v)"
echo "   npm:     $(npm -v)"

# 2. Make sure .env exists
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    echo ""
    echo "⚠️  No .env file found. Copying from .env.example."
    echo "    Please edit .env and set the correct DATABASE_URL for this VPS."
    cp .env.example .env
  else
    echo "❌ No .env file and no .env.example template found."
    exit 1
  fi
fi

# 3. Install dependencies
echo ""
echo "=== Installing dependencies (npm install — this takes 1-2 minutes) ==="
npm install --omit=optional 2>&1 | tail -5

# 4. Prisma: generate client + push schema to SQLite
echo ""
echo "=== Generating Prisma client + creating database ==="
npx prisma generate
npx prisma db push

# Make sure the db folder is writable by the web server
mkdir -p db
chmod -R 755 db
echo "✅ Database ready at: $(grep -oP 'file:\K.*' .env 2>/dev/null || echo '(see .env)')"

# 5. Build the production bundle
echo ""
echo "=== Building Next.js production bundle (this takes 1-3 minutes) ==="
npm run build 2>&1 | tail -20

echo ""
echo "============================================"
echo "✅  BUILD COMPLETE"
echo "============================================"
echo ""
echo "Next steps in the Webuzo panel:"
echo "  1. Open  Webuzo panel → Software → Setup Node.js App"
echo "  2. Create application with:"
echo "     - Application root:   rasmuta  (or your folder name)"
echo "     - Application URL:    your domain"
echo "     - Application mode:   Production"
echo "     - Node.js version:    18+"
echo "     - Application startup file: .next/standalone/server.js"
echo "  3. Add environment variables:"
echo "     - DATABASE_URL = (same value as in your .env file)"
echo "     - NODE_ENV     = production"
echo "     - PORT         = 3000"
echo "  4. Click 'Start App' and visit the App URL"
echo ""
echo "If you prefer to run the server manually (e.g. behind Nginx):"
echo "  NODE_ENV=production PORT=3000 node .next/standalone/server.js"
echo ""
echo "To keep the server running permanently with PM2:"
echo "  npm install -g pm2"
echo "  pm2 start .next/standalone/server.js --name rasmuta"
echo "  pm2 save && pm2 startup"
