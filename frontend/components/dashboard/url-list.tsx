'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Link2, RefreshCw, Search } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UrlListSkeleton, UrlRow } from '@/components/dashboard/url-row'
import { useUrls } from '@/hooks/use-urls'
import { formatShortUrlLabel } from '@/lib/api'
import { cn } from '@/lib/utils'

export function UrlList({ limit, searchable = true }: { limit?: number; searchable?: boolean }) {
  const { data, error, isLoading, isValidating, mutate } = useUrls()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    const list = q
      ? data.filter(
          (u) =>
            u.original_url.toLowerCase().includes(q) ||
            u.short_code.toLowerCase().includes(q) ||
            formatShortUrlLabel(u.short_code).toLowerCase().includes(q),
        )
      : data
    return limit ? list.slice(0, limit) : list
  }, [data, query, limit])

  if (isLoading) return <UrlListSkeleton rows={limit ?? 5} />

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertCircle className="size-8 text-destructive" aria-hidden />
        <div>
          <p className="font-medium">Could not load your links</p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </div>
        <Button variant="outline" onClick={() => mutate()} disabled={isValidating}>
          <RefreshCw data-icon="inline-start" />
          Try again
        </Button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Link2 className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-medium">No links yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first short link to see it here.</p>
        </div>
        <Link href="/dashboard/create" className={cn(buttonVariants(), 'h-10 px-5')}>
          Create a link
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="url-search" className="sr-only">
            Search links
          </label>
          <Input
            id="url-search"
            type="search"
            placeholder="Search links"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No links match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {filtered.map((url, i) => (
            <UrlRow key={url.id} url={url} index={i} />
          ))}
        </ul>
      )}
    </div>
  )
}
