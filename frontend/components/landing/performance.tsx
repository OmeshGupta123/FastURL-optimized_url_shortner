'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/landing/section-heading'
import { cn } from '@/lib/utils'

const RESULTS = [
  { value: '33%', label: 'Lower lookup latency', detail: 'With Redis caching enabled' },
  { value: '85%', label: 'Faster database lookups', detail: 'Using indexed queries' },
  { value: '300', label: 'Concurrent users', detail: 'Load tested' },
]

export function Performance({ asPage = false }: { asPage?: boolean }) {
  return (
    <section id="performance" className={cn('scroll-mt-20 py-14 sm:py-20', !asPage && 'border-t bg-muted/30')}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          as={asPage ? 'h1' : 'h2'}
          eyebrow="Engineering results"
          title="Measured, not marketed"
          description="Benchmark results from the project's own load tests and profiling."
        />

        <dl className="mt-14 grid gap-4 sm:grid-cols-3">
          {RESULTS.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border bg-card p-8 text-center"
            >
              <dd className="bg-gradient-to-br from-brand-start to-brand-end bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
                {item.value}
              </dd>
              <dt className="mt-3 text-base font-medium">{item.label}</dt>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            </motion.div>
          ))}
        </dl>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
          These are benchmark results from a controlled test environment. They are not a guarantee of production
          performance, which depends on your infrastructure and traffic.
        </p>
      </div>
    </section>
  )
}
