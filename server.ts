import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/apiRouter';
import { requestIdMiddleware, idempotencyMiddleware, standardErrorHandler } from './server/middleware';

dotenv.config();

const app = express();
const PORT = 3000;

// Body Parsers & Security Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Middlewares
app.use(requestIdMiddleware);
app.use(idempotencyMiddleware);

// Mount API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(standardErrorHandler);

// Serve Vite dev middleware or static production dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TeachMate AI Teacher Planning Assistant running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
