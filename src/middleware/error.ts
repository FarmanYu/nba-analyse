import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({
    code: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在'
  });
}

export function rateLimitHandler(req: Request, res: Response): void {
  res.status(429).json({
    code: 429,
    message: '请求过于频繁，请稍后再试'
  });
}