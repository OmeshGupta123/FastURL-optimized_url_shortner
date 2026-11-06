import type { Metadata } from 'next'
import { HowItWorks } from '@/components/landing/how-it-works'

export const metadata: Metadata = {
  title: 'How it works',
  description: 'Shorten a link in three steps: paste, generate, share.',
}

export default function HowItWorksPage() {
  return <HowItWorks asPage />
}
