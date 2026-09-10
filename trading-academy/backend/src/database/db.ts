import fs from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

const DB_DIR = path.resolve(process.cwd(), 'database')

const FILES = {
  users: 'users.json',
  posts: 'posts.json',
  comments: 'comments.json',
  ratings: 'ratings.json',
  settings: 'settings.json',
  sessions: 'sessions.json',
  logs: 'activity.json',
  categories: 'categories.json',
} as const

type TableName = keyof typeof FILES
type DBRow = Record<string, any>

const defaults: Record<TableName, any[]> = {
  users: [],
  posts: [],
  comments: [],
  ratings: [],
  settings: [{
    siteName: 'Trading Academy',
    siteDescription: 'Learn trading from beginners to advanced',
    darkMode: true,
    allowComments: true,
    requireApproval: true,
    postsPerPage: 12,
  }],
  sessions: [],
  logs: [],
  categories: [
    { id: 'cat-beginner', name: 'Beginner', slug: 'beginner', description: 'Start your trading journey with the fundamentals', order: 1 },
    { id: 'cat-price-action', name: 'Price Action', slug: 'price-action', description: 'Read the market like a pro using pure price movements', order: 2 },
    { id: 'cat-psychology', name: 'Psychology', slug: 'psychology', description: 'Master your emotions and develop a winning mindset', order: 3 },
    { id: 'cat-risk-management', name: 'Risk Management', slug: 'risk-management', description: 'Protect your capital and manage risk effectively', order: 4 },
  ],
}

async function ensureDir() {
  try {
    await fs.access(DB_DIR)
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true })
  }
}

async function ensureFiles() {
  await ensureDir()
  for (const [key, file] of Object.entries(FILES)) {
    const filePath = path.join(DB_DIR, file)
    try {
      await fs.access(filePath)
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaults[key as TableName], null, 2))
    }
  }
}

async function readTable<T>(table: TableName): Promise<T[]> {
  const filePath = path.join(DB_DIR, FILES[table])
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return defaults[table] as T[]
  }
}

async function writeTable<T>(table: TableName, data: T[]): Promise<void> {
  const filePath = path.join(DB_DIR, FILES[table])
  const tmp = filePath + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2))
  await fs.rename(tmp, filePath)
}

async function logActivity(action: string, userId: string, username: string, details: string) {
  const logs = await readTable<any>('logs')
  logs.unshift({ id: uuid(), action, userId, username, details, createdAt: new Date().toISOString() })
  if (logs.length > 500) logs.length = 500
  await writeTable('logs', logs)
}

export const db = {
  ensureFiles,
  readTable,
  writeTable,
  logActivity,
  uuid,
  DB_DIR,
}
