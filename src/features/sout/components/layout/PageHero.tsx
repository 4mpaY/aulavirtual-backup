import type { ReactNode } from 'react'

import { cn } from '@sout/lib/utils'

type Props = {
  eyebrow?: string
  title: ReactNode
  description?: string
  background?: ReactNode
  className?: string
  size?: 'default' | 'lg'
}

export default function PageHero({
  eyebrow,
  title,
  description,
  background,
  className,
  size = 'default',
}: Props) {
  return (
    <section
      className={cn(
        'sout-page-hero relative overflow-hidden bg-secondary',
        size === 'lg' && 'sout-page-hero--lg',
        className
      )}
    >
      {background}
      <div className="section-container sout-page-hero__inner relative">
        <div className="max-w-3xl">
          {eyebrow ? <span className="sout-page-hero__eyebrow">{eyebrow}</span> : null}
          <h1 className="sout-page-hero__title text-primary-foreground">{title}</h1>
          {description ? <p className="sout-page-hero__desc text-secondary-foreground/80">{description}</p> : null}
        </div>
      </div>
    </section>
  )
}
