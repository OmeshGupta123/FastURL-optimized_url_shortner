import Link from 'next/link'
import { Logo } from '@/components/logo'
import { API_BASE } from '@/lib/api'

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL

export function SiteFooter() {
  const links = [
    { href: '/features', label: 'Features', external: false },
    { href: '/performance', label: 'Performance', external: false },
    { href: '/how-it-works', label: 'How it works', external: false },
    { href: `${API_BASE}/docs`, label: 'Documentation', external: true },
    ...(GITHUB_URL ? [{ href: GITHUB_URL, label: 'GitHub', external: true }] : []),
  ]

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            High-performance URL shortening, built with FastAPI, PostgreSQL and Redis.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} FastURL. All rights reserved.
      </div>
    </footer>
  )
}
