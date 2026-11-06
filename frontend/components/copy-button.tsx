'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast-provider'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  value: string
  label?: string
  showLabel?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  className?: string
  /** Skip the toast, e.g. for the decorative demo preview. */
  silent?: boolean
}

export function CopyButton({
  value,
  label = 'Copy short link',
  showLabel = false,
  variant = 'ghost',
  className,
  silent = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      toast({ title: 'Could not copy', description: 'Your browser blocked clipboard access.', variant: 'error' })
      return
    }
    setCopied(true)
    if (!silent) toast({ title: 'Copied to clipboard', description: value })
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={showLabel ? 'lg' : 'icon-lg'}
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      className={cn(showLabel && 'h-9 px-3', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'check' : 'copy'}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.12 }}
          className="flex items-center gap-1.5"
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          {showLabel && <span>{copied ? 'Copied' : 'Copy'}</span>}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
