'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { SITE_PAGES } from '@/components/landing/site-pages'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function SectionSidebar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 border-l lg:block">
      <div className="sticky top-16 flex max-h-[calc(100dvh-4rem)] flex-col gap-6 overflow-y-auto p-5 pt-8">
        <nav aria-label="Sections">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Sections</p>
          <ul className="mt-3 flex flex-col gap-1">
            {SITE_PAGES.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                      active ? 'text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="section-active"
                        className="absolute inset-0 rounded-lg bg-accent"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="relative size-4" aria-hidden />
                    <span className="relative">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="rounded-2xl bg-gradient-to-br from-brand-start to-brand-end p-px">
          <div className="rounded-[calc(var(--radius-2xl)-1px)] bg-card p-4">
            <p className="text-sm font-semibold">Ready to shorten?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Create links, track clicks and manage everything in one dashboard.
            </p>
            <Link
              href={isAuthenticated ? '/dashboard' : '/register'}
              className={cn(buttonVariants(), 'mt-4 h-9 w-full')}
            >
              {isAuthenticated ? 'Open dashboard' : 'Get Started'}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function SectionTabs() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Sections"
      className="sticky top-16 z-40 border-b bg-background/85 backdrop-blur-md lg:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-3 py-2">
        {SITE_PAGES.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
