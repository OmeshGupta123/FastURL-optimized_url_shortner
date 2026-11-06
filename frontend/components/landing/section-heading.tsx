import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
  id?: string
  as?: 'h1' | 'h2'
}

export function SectionHeading({ eyebrow, title, description, className, id, as: Heading = 'h2' }: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      <p className="text-sm font-medium text-accent-foreground">{eyebrow}</p>
      <Heading id={id} className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </Heading>
      {description && <p className="mt-4 text-pretty text-muted-foreground">{description}</p>}
    </div>
  )
}
