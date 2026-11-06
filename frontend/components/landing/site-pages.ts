import { Gauge, House, Route, Sparkles, type LucideIcon } from 'lucide-react'

export interface SitePage {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export const SITE_PAGES: SitePage[] = [
  { href: '/', label: 'Home', description: 'Shorten a link right away.', icon: House },
  {
    href: '/features',
    label: 'Features',
    description: 'Caching, auth, click tracking and rate limiting.',
    icon: Sparkles,
  },
  {
    href: '/performance',
    label: 'Performance',
    description: 'Benchmarks from real load tests and profiling.',
    icon: Gauge,
  },
  {
    href: '/how-it-works',
    label: 'How it works',
    description: 'From long to short in three steps.',
    icon: Route,
  },
]
