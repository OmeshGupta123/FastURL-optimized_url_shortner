import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/page-header'
import { CreateUrlForm } from '@/components/dashboard/create-url-form'

export const metadata: Metadata = { title: 'Create URL' }

export default function CreatePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Create a short link" description="Paste a long URL and get a short, shareable link." />
      <div className="max-w-2xl">
        <Suspense>
          <CreateUrlForm />
        </Suspense>
      </div>
    </div>
  )
}
