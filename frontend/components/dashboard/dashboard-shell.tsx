'use client'

import { useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Link2, LogOut, PlusCircle, type LucideIcon } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/create', label: 'Create URL', icon: PlusCircle },
  { href: '/dashboard/urls', label: 'My URLs', icon: Link2 },
]

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <div className="flex items-center gap-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
              active ? 'text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="dashboard-nav-active"
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative size-4" aria-hidden />
            <span className="relative">{label}</span>
          </Link>
        )
      })}
    </div>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated, email, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [ready, isAuthenticated, router, pathname])

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status" aria-label="Loading dashboard">
        <div className="w-full max-w-sm space-y-3 px-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Logo />
            <nav aria-label="Dashboard navigation" className="hidden md:flex items-center">
              <NavLinks pathname={pathname} />
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {email && (
              <span
                className="hidden max-w-[200px] truncate rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-block"
                title={email}
              >
                {email}
              </span>
            )}
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="h-9 gap-1.5 px-3"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>

        {/* Mobile sub-navigation bar */}
        <nav aria-label="Dashboard mobile navigation" className="flex md:hidden border-t px-3 py-1.5 overflow-x-auto">
          <NavLinks pathname={pathname} />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
