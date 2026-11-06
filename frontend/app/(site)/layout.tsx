import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
