'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Link2, MousePointerClick } from 'lucide-react'

const DEMO_ORIGINAL = 'https://example.com/blog/2026/how-we-scaled-our-redirect-service?utm_source=newsletter'
const DEMO_SHORT = 'fasturl.example/x7K9pQ'

/** Decorative only: uses sample data and never touches the clipboard or the backend. */
export function ProductPreview() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = () => {
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-2xl border bg-card/90 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <span className="rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Demo preview · sample data
          </span>
        </div>

        <div className="mt-5 space-y-3 text-left">
          <div className="rounded-xl border bg-muted/50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Link2 className="size-3.5" aria-hidden /> Original URL
            </p>
            <p className="mt-1.5 truncate font-mono text-sm text-foreground/80">{DEMO_ORIGINAL}</p>
          </div>

          <div className="flex justify-center text-muted-foreground" aria-hidden>
            <ArrowRight className="size-4 rotate-90" />
          </div>

          <div className="rounded-xl border border-primary/30 bg-accent/60 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent-foreground">
              <Check className="size-3.5" aria-hidden /> Short link
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p className="truncate font-mono text-base font-medium text-primary">{DEMO_SHORT}</p>
              <button
                type="button"
                onClick={toggle}
                aria-label={copied ? 'Copied (demo)' : 'Copy (demo)'}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-transform hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'done' : 'idle'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-1.5"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex items-center gap-2 overflow-hidden text-sm text-success"
              role="status"
            >
              <MousePointerClick className="size-4" aria-hidden />
              Link copied. Ready to share.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
