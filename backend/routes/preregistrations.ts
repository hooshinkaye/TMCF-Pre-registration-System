import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { query } from '../db';

const router = Router();

// ── Define __dirname for ES modules ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── File Upload Setup ──
const uploadsDir = path.join(import.meta.dirname, '../uploads/profile_pics');
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
router.post('/submit-preregistration', upload.single('profile_pic'), async (req: Request, res: Response) => {
  try {
    // Honeypot check
    if (req.body.website_url) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    const {
      ln, fn, mn, ext, gen, bday, age, rel, addr,
      prog, shsg, shss, jhsg, elemg, lat, lng, quiz,
    } = req.body;

    // Validate required fields
    if (!ln || !fn || !prog) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const photoFilename = req.file?.filename || null;

    const sql = `
      INSERT INTO pre_registrations (
        last_name, first_name, middle_name, ext_name, gender, birthdate, age, religion, address,
        program, shsg, shss, jhsg, elemg, latitude, longitude, quiz_answer, photo_filename
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id;
    `;

    const result = await query(sql, [
      ln, fn, mn || null, ext || null, gen || null, bday || null, age || null, rel || null, addr || null,
      prog, shsg || null, shss || null, jhsg || null, elemg || null, lat || null, lng || null, quiz || null, photoFilename,
    ]);

    res.status(200).json({
      success: true,
      message: 'Pre-registration submitted successfully',
      id: result.rows[0].id,
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    res.status(500).json({ error: err.message || 'Submission failed' });
  }
});

// ── GET: Retrieve Pre-Registrations ──
router.get('/get-preregistrations', async (req: Request, res: Response) => {
  try {
    const program = req.query.program as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;

    let whereSql = '';
    const params: any[] = [];

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
  } catch (err: any) {
    console.error('Retrieval error:', err);
    res.status(500).json({ error: err.message || 'Failed to retrieve registrations' });
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
