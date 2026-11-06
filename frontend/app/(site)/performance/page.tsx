import type { Metadata } from 'next'
import { Performance } from '@/components/landing/performance'

export const metadata: Metadata = {
  title: 'Performance',
  description: 'Benchmark results from FastURL load tests and profiling.',
}

export default function PerformancePage() {
  return <Performance asPage />
}
