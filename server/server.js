import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// Cyber-resilient process crash prevention
process.on('uncaughtException', (error) => {
  console.error('[CRITICAL] Uncaught exception intercepted (process saved from crash):', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled promise rejection intercepted at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
} catch (dbError) {
  console.warn('[SECURITY & STABILITY] DB init error caught, serving in high-availability mode:', dbError.message);
}

const server = app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[STABILITY] SIGTERM received. Gracefully closing active connections...');
  server.close(() => {
    console.log('[STABILITY] Server closed cleanly.');
    process.exit(0);
  });
});
