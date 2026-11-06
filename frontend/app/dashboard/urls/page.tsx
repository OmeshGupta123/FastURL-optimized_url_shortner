import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { UrlList } from '@/components/dashboard/url-list'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'My URLs' }

export default function UrlsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My URLs"
        description="Every link you have created, newest first."
        action={
          <Link href="/dashboard/create" className={cn(buttonVariants(), 'h-10 px-4')}>
            <Plus data-icon="inline-start" />
            New link
          </Link>
        }
      />
      <UrlList />
    </div>
  )
}
