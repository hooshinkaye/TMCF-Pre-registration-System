import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';
import preregistrationRoutes from './routes/preregistrations';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ──
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// ── Initialize Database ──
let dbReady = false;
initializeDatabase()
  .then(() => {
    dbReady = true;
    console.log('✓ Database initialized successfully');
  })
  .catch((err) => {
    console.error('✗ Database initialization failed:', err);
    process.exit(1);
  });

// ── API Routes ──
app.use('/api', preregistrationRoutes);

// ── Serve React Frontend (production) ──
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// ── Fallback to React for client-side routing ──
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Error Handler ──
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${dbReady ? 'Ready' : 'Initializing...'}`);
});
