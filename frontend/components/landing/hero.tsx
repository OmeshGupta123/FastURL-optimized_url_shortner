'use client'

import { useId, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UrlCreatedCard } from '@/components/url-created-card'
import { ProductPreview } from '@/components/landing/product-preview'
import { useCreateUrl } from '@/hooks/use-create-url'
import { useAuth } from '@/lib/auth'
import { validateOriginalUrl } from '@/lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Hero() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { create, reset, pending, error, setError, created } = useCreateUrl()
  const [value, setValue] = useState('')
  const inputId = useId()
  const errorId = useId()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!isAuthenticated) {
      const validation = validateOriginalUrl(value)
      if (validation) {
        setError(validation)
        return
      }
      const next = `/dashboard/create?url=${encodeURIComponent(value.trim())}`
      router.push(`/register?next=${encodeURIComponent(next)}`)
      return
    }

    const result = await create(value)
    if (result) setValue('')
  }

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/2 size-[36rem] -translate-x-[70%] rounded-full bg-brand-start/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/2 size-[30rem] translate-x-[10%] rounded-full bg-brand-end/15 blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Redis-cached redirects. JWT-secured dashboard.
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Short Links.{' '}
            <span className="bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
              Faster Connections.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            Create, manage and share powerful short links with a high-performance URL shortening platform.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={onSubmit}
            noValidate
            className="mx-auto mt-9 max-w-2xl"
          >
            <label htmlFor={inputId} className="sr-only">
              URL to shorten
            </label>
            <div className="flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lg shadow-primary/5 transition-shadow focus-within:shadow-primary/15 sm:flex-row">
              <Input
                id={inputId}
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="Paste your long URL, https://..."
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (error) setError(null)
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="h-12 flex-1 border-transparent bg-transparent text-base shadow-none focus-visible:ring-0 sm:h-12"
              />
              <Button
                type="submit"
                disabled={pending}
                className="h-12 rounded-xl px-6 text-base shadow-sm shadow-primary/30"
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Shortening
                  </>
                ) : (
                  <>
                    Shorten URL
                    <ArrowRight data-icon="inline-end" />
                  </>
                )}
              </Button>
            </div>

            <div className="min-h-6 pt-2 text-left" id={errorId} role="alert">
              {error ? (
                <p className="flex items-start gap-1.5 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {error}
                </p>
              ) : (
                !isAuthenticated && (
                  <p className="text-center text-sm text-muted-foreground">
                    Free account required. We&apos;ll take you to sign up with your link ready to go.
                  </p>
                )
              )}
            </div>
          </motion.form>

          {created && (
            <div className="mx-auto mt-4 max-w-2xl text-left">
              <UrlCreatedCard url={created} onReset={reset} />
            </div>
          )}
        </motion.div>

        <div className="mt-16">
          <ProductPreview />
        </div>
      </div>
    </section>
  )
}
