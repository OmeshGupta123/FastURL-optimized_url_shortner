'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { CopyButton } from '@/components/copy-button'
import { buildShortUrl, type ShortUrl } from '@/lib/api'
import { cn } from '@/lib/utils'

interface UrlCreatedCardProps {
  url: ShortUrl
  onReset: () => void
  className?: string
  showDashboardLink?: boolean
}

export function UrlCreatedCard({ url, onReset, className, showDashboardLink = true }: UrlCreatedCardProps) {
  const shortUrl = buildShortUrl(url.short_code)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={cn('rounded-2xl border bg-card p-5 shadow-sm sm:p-6', className)}
    >
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.1 }}
          className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success"
        >
          <Check className="size-5" strokeWidth={3} aria-hidden />
        </motion.span>
        <div>
          <h2 className="text-base font-semibold">Your short link is ready</h2>
          <p className="text-sm text-muted-foreground">Copy it and share it anywhere.</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border bg-muted/50 p-2 pl-4">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 truncate font-mono text-sm font-medium text-primary hover:underline"
        >
          {shortUrl}
        </a>
        <CopyButton value={shortUrl} variant="default" showLabel />
      </div>

      <p className="mt-3 truncate text-sm text-muted-foreground">
        <span className="sr-only">Redirects to </span>
        <ArrowRight className="mr-1.5 inline size-3.5" aria-hidden />
        {url.original_url}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" size="lg" className="h-10 px-4" onClick={onReset}>
          <Plus data-icon="inline-start" />
          Create another link
        </Button>
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'h-10 px-4')}
        >
          <ExternalLink data-icon="inline-start" />
          Test redirect
        </a>
        {showDashboardLink && (
          <Link
            href="/dashboard/urls"
            className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'h-10 px-4')}
          >
            View all links
          </Link>
        )}
      </div>
    </motion.div>
  )
}
