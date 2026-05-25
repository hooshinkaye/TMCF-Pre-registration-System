# Deploy Node.js Backend to Render

Now that we've migrated to Node.js, here's how to deploy:

## Step 1: Push to GitHub

```powershell
cd "c:\TMCF Pre-registration System"
git add -A
git commit -m "Migrate to Node.js/Express backend"
git push
```

## Step 2: Update Render Web Service

Since you already have a web service on Render, you need to update it:

1. Go to [render.com](https://render.com) and select your web service
2. Go to **Settings** → **Build & Deploy**
3. Update these settings:
   - **Build Command**: `npm run build` (compile both frontend and backend)
   - **Start Command**: `npm start` (runs the Node.js server)

## Step 3: Add Environment Variables

Go to **Environment** in your Render settings and make sure you have:

```
DATABASE_URL=postgresql://enrollment_db_8jfc_user:dWyD2CwSjprRlDOklwL3Eg184vVz8cyL@dpg-d89mpavavr4c73cpn1s0-a.singapore-postgres.render.com/enrollment_db_8jfc
NODE_ENV=production
```

## Step 4: Wait for Redeploy

Render will automatically:
1. Detect your `Dockerfile` changes
2. Build the frontend with Vite
3. Compile the backend TypeScript
4. Start the Node.js server

Your app will be live at your Render URL in a few minutes.

## Testing Locally

Before pushing, test locally:

```powershell
# Install dependencies
npm install

# Run frontend + backend together
npm run dev:all
```

Then open `http://localhost:3000` in your browser. The frontend will proxy API calls to `http://localhost:5000`.

## What Changed

- **Frontend**: Still React + TypeScript, served by Express
- **Backend**: Now Node.js/Express instead of PHP
- **Database**: Same PostgreSQL connection
- **Deployment**: Docker-based (same as before)

You're now using a modern, type-safe fullstack JavaScript architecture! 🚀
