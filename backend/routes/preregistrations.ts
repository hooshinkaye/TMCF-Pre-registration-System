import { Router, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
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

// Use the service working directory so uploads are stored outside dist.
const rootDir = process.cwd();

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

const uploadProfilePic = (req: Request, res: Response, next: NextFunction) => {
  upload.single('profile_pic')(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'The selected image exceeds 5MB. Please upload a smaller photo.' });
      return;
    }

    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.status(400).json({ error: 'Unable to upload photo. Please try again.' });
  });
};

const normalizeText = (value: unknown): string => String(value || '').trim();
const normalizeEmail = (value: unknown): string => normalizeText(value).toLowerCase();
const normalizePhone = (value: unknown): string => normalizeText(value).replace(/\D/g, '');

async function removeUploadedFile(filename: string | null): Promise<void> {
  if (!filename) return;

  try {
    await fs.unlink(path.join(uploadsDir, filename));
  } catch (err) {
    console.warn('Unable to remove rejected upload:', err);
  }
}

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
})();

// ── POST: Submit Pre-Registration ──
router.post('/submit-preregistration', formSubmitLimiter, uploadProfilePic, async (req: Request, res: Response) => {
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
    const email = normalizeEmail(req.body.email) || null;
    const phone = normalizePhone(req.body.phone) || null;

    // Validate required fields
    if (!lastName || !firstName || !program) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const photoFilename = req.file?.filename || null;

    const duplicateResult = await query(
      `
        SELECT id
        FROM pre_registrations
        WHERE
          ($1::varchar IS NOT NULL AND LOWER(email) = $1::varchar)
          OR ($2::varchar IS NOT NULL AND regexp_replace(COALESCE(phone, ''), '\\D', '', 'g') = $2::varchar)
          OR (
            LOWER(first_name) = LOWER($3::varchar)
            AND LOWER(last_name) = LOWER($4::varchar)
            AND birthdate = NULLIF($5::varchar, '')::date
          )
        ORDER BY submitted_at DESC
        LIMIT 1;
      `,
      [email, phone, firstName, lastName, birthdate || ''],
    );

    if (duplicateResult.rows.length > 0) {
      await removeUploadedFile(photoFilename);
      return res.status(409).json({
        error: 'A pre-registration with the same student details already exists. Please contact the Registrar if you need to update your submission.',
      });
    }

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
router.patch('/pre-registrations/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const status = String(req.body.status || '').toLowerCase();
    const allowedStatuses = ['pending', 'verified', 'rejected'];

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid registration ID' });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await query(
      `
        UPDATE pre_registrations
        SET status = $1::varchar,
            reviewed_at = CASE WHEN $1::varchar = 'pending' THEN NULL ELSE CURRENT_TIMESTAMP END
        WHERE id = $2
        RETURNING *;
      `,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err: unknown) {
    console.error('Status update error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update status' });
  }
});

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
