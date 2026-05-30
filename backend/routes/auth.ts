import { Router, Request, Response } from 'express';

const router = Router();

// ── POST: Admin Login ──
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${Date.now()}:${adminPassword}`).toString('base64');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// ── POST: Admin Logout ──
router.post('/admin/logout', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
