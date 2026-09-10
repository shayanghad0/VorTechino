const API_BASE = '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
  createdAt: string
}

export interface Post {
  id: string
  slug: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  cover?: string
  author: string
  published: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  content: string
  parentId?: string
  likes: number
  likedBy: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  postId: string
  userId: string
  value: number
  createdAt: string
}

export interface Settings {
  siteName: string
  siteDescription: string
  darkMode: boolean
  allowComments: boolean
  requireApproval: boolean
  postsPerPage: number
}

export interface ActivityLog {
  id: string
  action: string
  userId: string
  username: string
  details: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  order: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  pages: number
}
