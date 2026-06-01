import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';

const router = Router();

// ── Rate Limiting for Form Submissions ──
const formSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per IP per 15 minutes
  message: 'Too many form submissions from this IP address. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Get application root directory ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// ── File Upload Setup ──
const uploadsDir = path.join(rootDir, 'uploads/profile_pics');
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP allowed.'));
    }
  },
});

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
})();

// ── POST: Submit Pre-Registration ──
router.post('/submit-preregistration', formSubmitLimiter, upload.single('profile_pic'), async (req: Request, res: Response) => {
  try {
    // Honeypot check
    if (req.body.website_url) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    const {
      ln, fn, mn, ext, gen, bday, age, rel, addr,
      prog, shsg, shss, jhsg, elemg, lat, lng, quiz,
    } = req.body;

    const lastName = ln || req.body.last_name || req.body.lastName;
    const firstName = fn || req.body.first_name || req.body.firstName;
    const middleName = mn || req.body.middle_name || req.body.middleName;
    const extensionName = ext || req.body.ext_name || req.body.extension;
    const gender = gen || req.body.gender;
    const birthdate = bday || req.body.birth_date || req.body.birthDate;
    const religion = rel || req.body.religion || req.body.relationship;
    const address = addr || req.body.address;
    const program = prog || req.body.program;
    const email = req.body.email || null;
    const phone = req.body.phone || null;

    // Validate required fields
    if (!lastName || !firstName || !program) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const photoFilename = req.file?.filename || null;

    const sql = `
      INSERT INTO pre_registrations (
        last_name, first_name, middle_name, ext_name, gender, birthdate, age, religion, address,
        program, shsg, shss, jhsg, elemg, latitude, longitude, quiz_answer, photo_filename, email, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING id;
    `;

    const result = await query(sql, [
      lastName, firstName, middleName || null, extensionName || null, gender || null, birthdate || null,
      age || req.body.age || null, religion || null, address || null, program,
      shsg || req.body.seniorHighSchoolYear || null,
      shss || req.body.seniorHighSchool || null,
      jhsg || req.body.juniorHighSchool || null,
      elemg || req.body.elementary || null,
      lat || req.body.latitude || null,
      lng || req.body.longitude || null,
      quiz || req.body.quiz_answer || null,
      photoFilename,
      email,
      phone,
    ]);

    res.status(200).json({
      success: true,
      message: 'Pre-registration submitted successfully',
      id: result.rows[0].id,
    });
  } catch (err: unknown) {
    console.error('Submission error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Submission failed' });
  }
});

// ── GET: Retrieve Pre-Registrations ──
router.get('/get-preregistrations', async (req: Request, res: Response) => {
  try {
    const program = req.query.program as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;

    let whereSql = '';
    const params: Array<string | number> = [];

    if (program) {
      whereSql = 'WHERE program = $1';
      params.push(program);
    }

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM pre_registrations ${whereSql}`;
    const countResult = await query(countSql, params);
    const total = parseInt(countResult.rows[0].total);

    // Get records
    const paramIndex = params.length + 1;
    const sql = `
      SELECT * FROM pre_registrations ${whereSql}
      ORDER BY submitted_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await query(sql, params);

    res.status(200).json({
      success: true,
      total,
      count: result.rows.length,
      limit,
      offset,
      data: result.rows,
    });
  } catch (err: unknown) {
    console.error('Retrieval error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to retrieve registrations' });
  }
});

// ── POST: Initialize Database ──
router.post('/init-db', async (req: Request, res: Response) => {
  try {
    // The database is initialized when the server starts
    // This endpoint just confirms it
    res.status(200).json({
      success: true,
      message: 'Database is ready',
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Database initialization failed' });
  }
});

export default router;
