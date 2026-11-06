import type { Metadata } from 'next'
import { Features } from '@/components/landing/features'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Redis caching, JWT authentication, click tracking and rate limiting in a focused URL shortener.',
}

export default function FeaturesPage() {
  return <Features asPage />
}
