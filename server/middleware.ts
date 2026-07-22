import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { repository } from './repository';

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      idempotencyKey?: string;
    }
  }
}

// Request ID Middleware
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incomingId = req.header('X-Request-ID') || req.header('x-request-id');
  req.requestId = incomingId || `req-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  res.setHeader('X-Request-ID', req.requestId);
  next();
}

// Idempotency Middleware
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.header('X-Idempotency-Key') || req.header('x-idempotency-key');
  if (!key) {
    return next();
  }

  req.idempotencyKey = key;
  const existing = repository.getIdempotency(key);
  if (existing) {
    return res.status(existing.status).json(existing.body);
  }

  // Intercept json response to cache idempotency result
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      repository.setIdempotency(key, res.statusCode, body);
    }
    return originalJson(body);
  };

  next();
}

// Zod Body Validation Middleware Factory
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'Request payload validation failed',
            details: err.issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
          },
        });
      }
      next(err);
    }
  };
}

// Standard Error Handler Middleware
export function standardErrorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(`[API ERROR] ${req.requestId} - ${req.method} ${req.url}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || (statusCode === 400 ? 'INVALID_REQUEST' : statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR');

  return res.status(statusCode).json({
    error: {
      code: errorCode,
      message: err.message || 'An unexpected internal error occurred on the server.',
      details: err.details || undefined,
      requestId: req.requestId || `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
  });
}
