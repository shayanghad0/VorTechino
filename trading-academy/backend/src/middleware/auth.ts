import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../database/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'trading-academy-secret-key-2026'

export interface AuthRequest extends Request {
  user?: { id: string; username: string; email: string; role: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.user = decoded
  } catch {}
  next()
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' })
  next()
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
  next()
}

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
