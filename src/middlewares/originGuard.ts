import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to block direct browser access and only allow requests from allowed origins
 */
export function originGuard(req: Request, res: Response, next: NextFunction): void {
  // Get allowed origins from environment
  const allowedOrigins = (process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URLS?.split(',') || []
    : process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5173']).filter((origin): origin is string => !!origin);

  // Get the origin or referer from the request
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Check if request has origin or referer header
  if (!origin && !referer) {
    // Direct browser access (no origin/referer headers)
    res.status(403).json({ 
      message: 'Direct access not allowed. Please access through the application.' 
    });
    return;
  }

  // Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    next();
    return;
  }

  // Check if referer starts with any allowed origin
  if (referer) {
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      referer.startsWith(allowedOrigin)
    );
    if (isAllowed) {
      next();
      return;
    }
  }

  // If we get here, the origin is not allowed
  res.status(403).json({ 
    message: 'Access denied. Request must come from authorized domain.' 
  });
}
