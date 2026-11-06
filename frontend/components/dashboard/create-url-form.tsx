'use client'

import { useId, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UrlCreatedCard } from '@/components/url-created-card'
import { useCreateUrl } from '@/hooks/use-create-url'

export function CreateUrlForm() {
  const params = useSearchParams()
  const { create, reset, pending, error, setError, created } = useCreateUrl()
  const [value, setValue] = useState(params.get('url') ?? '')
  const inputId = useId()
  const errorId = useId()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await create(value)
    if (result) setValue('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="rounded-2xl border bg-card p-5 sm:p-6">
        <label htmlFor={inputId} className="text-sm font-medium">
          Destination URL
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id={inputId}
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://www.example.com/very/long/path"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="h-11 flex-1"
          />
          <Button type="submit" disabled={pending} className="h-11 px-6">
            {pending ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Shortening
              </>
            ) : (
              <>
                <Scissors data-icon="inline-start" />
                Shorten URL
              </>
            )}
          </Button>
        </div>
        <div id={errorId} role="alert" className="min-h-5 pt-2">
          {error && (
            <p className="flex items-start gap-1.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Must start with http:// or https:// and be at most 2048 characters.</p>
      </form>

      {created && <UrlCreatedCard url={created} onReset={reset} />}
    </div>
  )
}
