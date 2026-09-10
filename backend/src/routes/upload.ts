import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { db } from '../database/db.js'
import { requireAuth } from '../middleware/auth.js'

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads')

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try { await fs.access(UPLOADS_DIR) } catch { await fs.mkdir(UPLOADS_DIR, { recursive: true }) }
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${db.uuid()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('File type not allowed'))
  },
})

const router = Router()

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename })
})

export default router
