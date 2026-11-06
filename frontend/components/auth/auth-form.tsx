'use client'

import { useEffect, useId, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth'
import { ApiError, validateEmail, validatePassword } from '@/lib/api'

type Mode = 'login' | 'register'

const COPY = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to manage your short links.',
    submit: 'Log in',
    pending: 'Logging in',
    switchText: "Don't have an account?",
    switchLink: 'Create one',
    switchHref: '/register',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Start shortening and tracking links in seconds.',
    submit: 'Create account',
    pending: 'Creating account',
    switchText: 'Already have an account?',
    switchLink: 'Log in',
    switchHref: '/login',
  },
} as const

function safeNext(value: string | null): string {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value
  return '/dashboard'
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const params = useSearchParams()
  const { login, register, ready, isAuthenticated } = useAuth()
  const copy = COPY[mode]
  const next = safeNext(params.get('next'))
  const expired = params.get('expired') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const emailId = useId()
  const passwordId = useId()

  useEffect(() => {
    if (ready && isAuthenticated && !pending) router.replace(next)
  }, [ready, isAuthenticated, pending, router, next])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const errors = {
      email: validateEmail(email) ?? undefined,
      password: (mode === 'register' ? validatePassword(password) : password ? null : 'Enter your password.') ?? undefined,
    }
    setFieldErrors(errors)
    if (errors.email || errors.password) return

    setPending(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      router.replace(next)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setPending(false)
    }
  }

  const nextQuery = params.get('next') ? `?next=${encodeURIComponent(next)}` : ''

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8"
        >
          <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>

          {expired && !formError && (
            <p role="status" className="mt-5 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground">
              Your session expired. Please log in again.
            </p>
          )}

          {formError && (
            <p
              role="alert"
              className="mt-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {formError}
            </p>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor={emailId} className="text-sm font-medium">
                Email
              </label>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
              />
              {fieldErrors.email && (
                <p id={`${emailId}-error`} className="text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor={passwordId} className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id={`${passwordId}-error`} className="text-sm text-destructive">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button type="submit" disabled={pending} className="h-11 w-full text-base shadow-sm shadow-primary/30">
              {pending ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  {copy.pending}
                </>
              ) : (
                copy.submit
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {copy.switchText}{' '}
            <Link href={`${copy.switchHref}${nextQuery}`} className="font-medium text-primary hover:underline">
              {copy.switchLink}
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
