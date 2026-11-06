'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ClipboardPaste, Share2, Zap, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ClipboardPaste, title: 'Paste your long URL', description: 'Drop any http or https link into the input.' },
  { icon: Zap, title: 'Generate your short link', description: 'We create a compact six-character code instantly.' },
  { icon: Share2, title: 'Copy and share', description: 'Copy the link and use it anywhere you like.' },
]

export function HowItWorks({ asPage = false }: { asPage?: boolean }) {
  return (
    <section id="how-it-works" className={cn('scroll-mt-20 py-14 sm:py-20', !asPage && 'border-t')}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          as={asPage ? 'h1' : 'h2'}
          eyebrow="How it works"
          title="From long to short in three steps"
        />

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative rounded-2xl border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-mono text-sm text-muted-foreground" aria-hidden>
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold">
                <span className="sr-only">Step {index + 1}: </span>
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 rounded-3xl border bg-gradient-to-br from-brand-start/15 via-card to-card p-8 text-center sm:p-12">
          <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to shorten your first link?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Create an account and start managing your links in under a minute.
          </p>
          <Link
            href="/register"
            className={cn(buttonVariants(), 'mt-7 h-11 px-6 text-base shadow-sm shadow-primary/30')}
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
