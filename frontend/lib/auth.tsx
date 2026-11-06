'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { api, EMAIL_KEY, TOKEN_KEY, UNAUTHORIZED_EVENT } from '@/lib/api'

interface AuthContextValue {
  /** False until localStorage has been read on the client. */
  ready: boolean
  token: string | null
  email: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [ready, setReady] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(EMAIL_KEY)
    setToken(null)
    setEmail(null)
    void mutate(() => true, undefined, { revalidate: false })
  }, [mutate])

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY)
    const savedEmail = window.localStorage.getItem(EMAIL_KEY)
    setToken(savedToken)
    setEmail(savedEmail)
    setReady(true)

    if (savedToken) {
      api
        .getMe()
        .then((profile) => {
          setEmail(profile.email)
          window.localStorage.setItem(EMAIL_KEY, profile.email)
        })
        .catch(() => {
          clearSession()
        })
    }
  }, [clearSession])

  const logout = useCallback(() => {
    clearSession()
    router.push('/login')
  }, [clearSession, router])

  useEffect(() => {
    const onUnauthorized = () => {
      clearSession()
      router.replace('/login?expired=1')
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [clearSession, router])

  const login = useCallback(async (userEmail: string, password: string) => {
    const result = await api.login(userEmail.trim(), password)
    window.localStorage.setItem(TOKEN_KEY, result.access_token)
    window.localStorage.setItem(EMAIL_KEY, userEmail.trim())
    setToken(result.access_token)
    setEmail(userEmail.trim())
  }, [])

  const register = useCallback(
    async (userEmail: string, password: string) => {
      await api.register(userEmail.trim(), password)
      await login(userEmail, password)
    },
    [login],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      token,
      email,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [ready, token, email, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
