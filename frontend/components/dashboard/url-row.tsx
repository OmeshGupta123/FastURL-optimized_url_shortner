'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2, MousePointerClick, Trash2 } from 'lucide-react'
import { useSWRConfig } from 'swr'
import { CopyButton } from '@/components/copy-button'
import { useToast } from '@/components/toast-provider'
import { URLS_KEY } from '@/hooks/use-urls'
import { api, buildShortUrl, formatShortUrlLabel, type ShortUrl } from '@/lib/api'

export function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function UrlRow({ url, index = 0 }: { url: ShortUrl; index?: number }) {
  const shortUrl = buildShortUrl(url.short_code)
  const [deleting, setDeleting] = useState(false)
  const { mutate } = useSWRConfig()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!window.confirm(`Delete the short link for "${url.original_url}"?`)) {
      return
    }
    setDeleting(true)
    try {
      await api.deleteUrl(url.id)
      void mutate(URLS_KEY)
      toast({ title: 'Link deleted', description: 'The short link has been removed.' })
    } catch (err) {
      toast({
        title: 'Failed to delete link',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      })
      setDeleting(false)
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-mono text-sm font-medium text-primary hover:underline"
        >
          {formatShortUrlLabel(url.short_code)}
        </a>
        <p className="mt-1 truncate text-sm text-muted-foreground" title={url.original_url}>
          {url.original_url}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 tabular-nums" title="Clicks">
            <MousePointerClick className="size-4" aria-hidden />
            <span className="font-medium text-foreground">{url.clicks.toLocaleString()}</span>
            <span className="sr-only">clicks</span>
          </span>
          <time dateTime={url.created_at} className="hidden whitespace-nowrap lg:block">
            {formatDate(url.created_at)}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <CopyButton value={shortUrl} />
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open short link in a new tab"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ExternalLink className="size-4" />
          </a>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete short link"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </button>
        </div>
      </div>
    </motion.li>
  )
}

export function UrlListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="divide-y rounded-2xl border bg-card" role="status" aria-label="Loading links">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 p-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  )
}
