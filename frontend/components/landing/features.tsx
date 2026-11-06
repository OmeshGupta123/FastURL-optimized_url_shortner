'use client'

import { motion } from 'framer-motion'
import { BarChart3, Database, Gauge, KeyRound, Link2, ShieldAlert, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { cn } from '@/lib/utils'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Gauge,
    title: 'Lightning-fast redirection',
    description: 'Short codes resolve through an indexed lookup and answer with a 307 redirect to the original URL.',
  },
  {
    icon: Database,
    title: 'Redis-powered caching',
    description: 'Hot links are served from Redis, keeping lookups off the database path whenever possible.',
  },
  {
    icon: KeyRound,
    title: 'Secure JWT authentication',
    description: 'OAuth2 password flow with signed bearer tokens. Your links are only visible to you.',
  },
  {
    icon: Link2,
    title: 'URL management',
    description: 'Create links, search them, copy them and review everything you have shortened in one place.',
  },
  {
    icon: BarChart3,
    title: 'Click tracking',
    description: 'Every redirect increments a counter instantly, then syncs to PostgreSQL in the background.',
  },
  {
    icon: ShieldAlert,
    title: 'Rate limiting',
    description: 'Per-endpoint request limits protect the service from abuse and keep response times predictable.',
  },
]

export function Features({ asPage = false }: { asPage?: boolean }) {
  return (
    <section id="features" className={cn('scroll-mt-20 py-14 sm:py-20', !asPage && 'border-t')}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          as={asPage ? 'h1' : 'h2'}
          eyebrow="Features"
          title="Everything a link needs. Nothing it doesn't."
          description="A focused toolkit built on FastAPI, PostgreSQL and Redis for creating and managing short links."
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <motion.li
              key={title}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <motion.span
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
                className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <Icon className="size-5" aria-hidden />
              </motion.span>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
