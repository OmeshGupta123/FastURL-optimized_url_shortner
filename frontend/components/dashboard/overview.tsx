'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Link2, MousePointerClick, Trophy, type LucideIcon } from 'lucide-react'
import { UrlList } from '@/components/dashboard/url-list'
import { useUrls } from '@/hooks/use-urls'
import { formatShortUrlLabel } from '@/lib/api'

function Stat({ icon: Icon, label, value, loading }: { icon: LucideIcon; label: string; value: string; loading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        {label}
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-muted" />
      ) : (
        <p className="mt-2 truncate text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      )}
    </motion.div>
  )
}

export function Overview() {
  const { data, isLoading } = useUrls()
  const totalClicks = data?.reduce((sum, u) => sum + u.clicks, 0) ?? 0
  const top = data?.length ? [...data].sort((a, b) => b.clicks - a.clicks)[0] : null

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Link2} label="Total links" value={(data?.length ?? 0).toLocaleString()} loading={isLoading} />
        <Stat icon={MousePointerClick} label="Total clicks" value={totalClicks.toLocaleString()} loading={isLoading} />
        <Stat
          icon={Trophy}
          label="Top link"
          value={top && top.clicks > 0 ? formatShortUrlLabel(top.short_code).replace(/^[^/]+\/urls\/r\//, '/') : '—'}
          loading={isLoading}
        />
      </div>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="recent-heading" className="text-lg font-semibold">
            Recent links
          </h2>
          <Link href="/dashboard/urls" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <UrlList limit={5} searchable={false} />
      </section>
    </div>
  )
}
