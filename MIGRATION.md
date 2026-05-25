# Node.js Backend Migration

The backend has been migrated from PHP to Node.js/Express. Here's what changed:

## What's New

✅ **Modern Backend Stack**
- Express.js (lightweight, fast web framework)
- PostgreSQL via `pg` (Node.js native driver)
- Multer for file uploads
- TypeScript for type safety
- CORS support

✅ **Better Architecture**
- Clean separation of concerns
- Type-safe API routes
- Automatic database initialization
- Structured error handling

## What to Remove (Optional)

The following PHP files are no longer used:
- `api/db.php`
- `api/init-db.php`
- `api/submit-preregistration.php`
- `api/get-preregistrations.php`
- `api/README.md`
- `schedule.php` (endpoints moved to `backend/routes/preregistrations.ts`)
- `index.php` (not needed anymore)

You can delete these if you want to clean up, but they won't affect the app.

## API Endpoints (Same as Before)

- `POST /api/submit-preregistration` - Submit form
- `GET /api/get-preregistrations` - Retrieve submissions
- `POST /api/init-db` - Check database status

## Development

**Run frontend only:**
```
npm run dev
```

**Run backend only:**
```
npm run dev:backend
```

**Run both together:**
```
npm run dev:all
```

## Building for Production

```
npm run build
```

This builds both frontend and backend:
- Frontend: `dist/` (Vite build)
- Backend: `dist/backend/` (TypeScript compilation)

## Environment Variables

Create a `.env` file (copy from `.env.example`):
```
DATABASE_URL=your_postgresql_url
NODE_ENV=production
PORT=5000
```

## Starting the Server

```
npm start
```

Or locally:
```
npm run dev:all
```

That's it! The app is now fully Node.js-based with a modern architecture suitable for your paper.
