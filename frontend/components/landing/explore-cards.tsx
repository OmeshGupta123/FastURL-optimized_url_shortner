import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SITE_PAGES } from '@/components/landing/site-pages'

export function ExploreCards() {
  const pages = SITE_PAGES.filter((page) => page.href !== '/')

  return (
    <section aria-labelledby="explore-heading" className="border-t py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          id="explore-heading"
          eyebrow="Explore"
          title="Learn what's under the hood"
          description="Each section has its own page. Jump in from here or use the navigation bar above."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {pages.map(({ href, label, description, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:glow-brand focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-5 flex items-center justify-between text-base font-semibold">
                  {label}
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
