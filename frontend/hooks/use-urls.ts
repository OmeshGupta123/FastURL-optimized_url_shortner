'use client'

import useSWR from 'swr'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export const URLS_KEY = '/urls/'

export function useUrls() {
  const { token } = useAuth()
  const swr = useSWR(token ? URLS_KEY : null, () => api.listUrls(), {
    revalidateOnFocus: true,
    shouldRetryOnError: (error) => !(error instanceof ApiError && error.status < 500 && error.status !== 0),
  })
  return swr
}
