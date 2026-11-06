'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { SITE_PAGES } from '@/components/landing/site-pages'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { ready, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const primaryHref = isAuthenticated ? '/dashboard' : '/register'
  const primaryLabel = isAuthenticated ? 'Dashboard' : 'Get Started'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors',
        scrolled ? 'border-border bg-background/85 backdrop-blur-md' : 'border-transparent bg-background/60 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {SITE_PAGES.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                    active ? 'text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="site-nav-active"
                      className="absolute inset-0 rounded-lg bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative size-4" aria-hidden />
                  <span className="relative">{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {ready && !isAuthenticated && (
            <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }), 'h-9 px-3')}>
              Login
            </Link>
          )}
          <Link href={primaryHref} className={cn(buttonVariants(), 'h-9 px-4 shadow-sm shadow-primary/25')}>
            {primaryLabel}
          </Link>
        </div>
      </div>

      {/* Mobile navigation row */}
      <nav aria-label="Mobile navigation" className="flex md:hidden border-t px-3 py-1.5 overflow-x-auto gap-1">
        {SITE_PAGES.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
