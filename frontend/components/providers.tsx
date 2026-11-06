'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'
import { AuthProvider } from '@/lib/auth'
import { ToastProvider } from '@/components/toast-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="fasturl.theme">
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
