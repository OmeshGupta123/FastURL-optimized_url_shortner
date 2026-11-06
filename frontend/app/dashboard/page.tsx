import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { Overview } from '@/components/dashboard/overview'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your links and their clicks."
        action={
          <Link href="/dashboard/create" className={cn(buttonVariants(), 'h-10 px-4')}>
            <Plus data-icon="inline-start" />
            New link
          </Link>
        }
      />
      <Overview />
    </div>
  )
}
