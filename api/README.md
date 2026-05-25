# Database Setup Instructions

This document explains how to set up the PostgreSQL database for the TMCF Pre-Registration System on Render.

## Steps to Setup

### 1. Environment Variables on Render

Add these environment variables to your Render deployment:

```
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
DB_NAME=database_name
DB_USER=username
DB_PASS=password
DB_PORT=5432
```

If you're using Render's PostgreSQL, the `DATABASE_URL` will be provided automatically. You can find it in your Render dashboard under "Environment" in your PostgreSQL service.

### 2. Initialize the Database

Once deployed, visit this URL **once** to create the database tables:

```
https://your-app-url.onrender.com/api/init-db.php
```

You should see a success message. If there's an error, check your database connection settings.

### 3. API Endpoints

The system now has these endpoints:

- **Submit Form**: `POST /api/submit-preregistration.php`
  - Accepts form data and file uploads
  - Stores submissions in the database

- **Get Registrations**: `GET /api/get-preregistrations.php?limit=100&offset=0&program=optional`
  - Returns all pre-registrations as JSON
  - Optional filters by program

### 4. Admin Dashboard

View all pre-registrations at:

```
https://your-app-url.onrender.com/admin
```

The dashboard shows:
- Total submissions count
- Charts by program and gender
- Searchable table of all submissions
- Export to CSV functionality

### 5. File Storage

Uploaded profile pictures are stored in:

```
/uploads/profile_pics/
```

Make sure this directory is writable by the web server (already set in the PHP code).

## Troubleshooting

### Database Connection Error

If you see a database connection error, verify:
1. PostgreSQL service is running on Render
2. `DATABASE_URL` environment variable is set correctly
3. The database exists in PostgreSQL

### Upload Errors

If photo uploads fail:
1. Ensure `/uploads/profile_pics/` directory exists and is writable
2. Check file size limits (max 5MB)
3. Only JPG, PNG, and WebP files are allowed

### CSV Export Not Working

Make sure the admin dashboard can query the database. Check browser console for API errors.

## Database Schema

The system creates this table:

```sql
CREATE TABLE pre_registrations (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    ext_name VARCHAR(50),
    gender VARCHAR(20),
    birthdate DATE,
    age INTEGER,
    religion VARCHAR(100),
    address TEXT,
    program VARCHAR(200) NOT NULL,
    shsg VARCHAR(50),
    shss VARCHAR(50),
    jhsg VARCHAR(50),
    elemg VARCHAR(50),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    quiz_answer TEXT,
    photo_filename VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps

1. Deploy these files to Render
2. Run the init-db.php once
3. Test a form submission
4. View results in the admin dashboard
