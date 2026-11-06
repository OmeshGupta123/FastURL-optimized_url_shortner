export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '')

export const TOKEN_KEY = 'fasturl.token'
export const EMAIL_KEY = 'fasturl.email'
export const UNAUTHORIZED_EVENT = 'fasturl:unauthorized'

export interface ShortUrl {
  id: number
  original_url: string
  short_code: string
  created_at: string
  clicks: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserProfile {
  id: number
  email: string
  created_at: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

function extractDetail(body: unknown): string | null {
  if (!body || typeof body !== 'object' || !('detail' in body)) return null
  const detail = (body as { detail: unknown }).detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (d && typeof d === 'object' && 'msg' in d ? String(d.msg) : null))
      .filter(Boolean)
      .join('. ')
  }
  return null
}

function fallbackMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Your session has expired. Please sign in again.'
    case 403:
      return 'You are not allowed to do that.'
    case 404:
      return 'We could not find what you were looking for.'
    case 422:
      return 'Please check the details you entered and try again.'
    case 429:
      return 'Too many requests. Please wait a moment and try again.'
    default:
      return 'Something went wrong on our side. Please try again.'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
  json?: unknown
  form?: Record<string, string>
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', json, form, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  let body: BodyInit | undefined

  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = new URLSearchParams(form).toString()
  }

  const token = auth ? getStoredToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { method, headers, body })
  } catch {
    throw new ApiError(
      0,
      `Cannot reach the FastURL API at ${API_BASE}. Make sure the backend is running.`,
    )
  }

  let payload: unknown = null
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    payload = await response.json().catch(() => null)
  }

  if (!response.ok) {
    if (response.status === 401 && auth && token) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(
      response.status,
      extractDetail(payload) ?? fallbackMessage(response.status),
    )
  }

  return payload as T
}

export const api = {
  register: (email: string, password: string) =>
    apiRequest<UserProfile>('/users/', {
      method: 'POST',
      json: { email, password },
      auth: false,
    }),
  login: (email: string, password: string) =>
    apiRequest<TokenResponse>('/login', {
      method: 'POST',
      form: { username: email, password },
      auth: false,
    }),
  getMe: () => apiRequest<UserProfile>('/users/me'),
  listUrls: () => apiRequest<ShortUrl[]>('/urls/'),
  createUrl: (original_url: string) =>
    apiRequest<ShortUrl>('/urls/', { method: 'POST', json: { original_url } }),
  deleteUrl: (id: number) =>
    apiRequest<void>(`/urls/${id}`, { method: 'DELETE' }),
}

export function buildShortUrl(shortCode: string): string {
  return `${API_BASE}/urls/r/${shortCode}`
}

export function formatShortUrlLabel(shortCode: string): string {
  return buildShortUrl(shortCode).replace(/^https?:\/\//, '')
}

/** Mirrors backend validation: http(s) scheme, max 2048 chars. */
export function validateOriginalUrl(value: string): string | null {
  const url = value.trim()
  if (!url) return 'Enter the URL you want to shorten.'
  if (url.length > 2048) return 'URLs can be at most 2048 characters long.'
  if (!/^https?:\/\//i.test(url)) return 'The URL must start with http:// or https://'
  try {
    new URL(url)
  } catch {
    return 'That does not look like a valid URL.'
  }
  return null
}

export function validatePassword(value: string): string | null {
  if (value.length < 6) return 'Password must be at least 6 characters.'
  if (value.length > 128) return 'Password must be at most 128 characters.'
  return null
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address.'
  return null
}
