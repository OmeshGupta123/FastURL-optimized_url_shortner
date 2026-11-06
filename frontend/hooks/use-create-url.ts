'use client'

import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'
import { api, ApiError, validateOriginalUrl, type ShortUrl } from '@/lib/api'
import { URLS_KEY } from '@/hooks/use-urls'
import { useToast } from '@/components/toast-provider'

export function useCreateUrl() {
  const { mutate } = useSWRConfig()
  const { toast } = useToast()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<ShortUrl | null>(null)

  const create = useCallback(
    async (rawUrl: string) => {
      const validation = validateOriginalUrl(rawUrl)
      if (validation) {
        setError(validation)
        return null
      }

      setPending(true)
      setError(null)
      try {
        const result = await api.createUrl(rawUrl.trim())
        setCreated(result)
        void mutate(URLS_KEY)
        toast({ title: 'Short link created', description: 'Your link is ready to share.' })
        return result
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
        setError(message)
        if (err instanceof ApiError && (err.status === 429 || err.status === 0)) {
          toast({
            title: err.status === 429 ? 'Slow down a little' : 'Network error',
            description: message,
            variant: 'error',
          })
        }
        return null
      } finally {
        setPending(false)
      }
    },
    [mutate, toast],
  )

  const reset = useCallback(() => {
    setCreated(null)
    setError(null)
  }, [])

  return { create, reset, pending, error, setError, created }
}
