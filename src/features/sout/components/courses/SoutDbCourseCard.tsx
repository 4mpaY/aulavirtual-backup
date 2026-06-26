'use client'

import type { MouseEvent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Clock, Users, ChevronRight, ShoppingCart, Check } from 'lucide-react'

import { Button } from '@sout/components/ui/button'
import type { PublicCourse } from '@sout/lib/getPublicCourses'
import { useCart } from '@/features/web/cart/context/CartContext'
import CourseThumbnail from '@/utils/components/CourseThumbnail'
import UserAvatar from '@/utils/components/UserAvatar'
import { cn } from '@sout/lib/utils'

const nivelLabel: Record<string, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
}

type Props = {
  course: PublicCourse
  className?: string
  compact?: boolean
}

export default function SoutDbCourseCard({ course, className, compact = false }: Props) {
  const router = useRouter()
  const { addToCart, isInCart } = useCart()
  const inCart = isInCart(course.id)
  const purchased = course.es_comprado

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: course.id,
      type: 'CURSO',
      titulo: course.titulo,
      slug: course.slug,
      miniatura: course.miniatura ?? undefined,
      precio: course.precio,
      moneda: course.moneda,
    })
  }

  const priceLabel = course.es_gratis
    ? 'Gratis'
    : `${course.moneda} ${Number(course.precio).toFixed(2)}`

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col bg-card rounded-2xl overflow-hidden shadow-lg card-hover border border-border cursor-pointer',
        className
      )}
      onClick={() => router.push(`/cursos/${course.slug}`)}
    >
      <div className={cn('relative shrink-0 overflow-hidden', compact ? 'h-48 md:h-56' : 'h-48')}>
        <CourseThumbnail
          src={course.miniatura}
          title={course.titulo}
          sx={{ width: '100%', height: '100%', minHeight: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent pointer-events-none" />

        {course.categoria ? (
          <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-heading font-bold z-[1]">
            {course.categoria.nombre}
          </div>
        ) : null}

        {course.nivel ? (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-heading font-bold z-[1]">
            {nivelLabel[course.nivel] ?? course.nivel}
          </div>
        ) : null}
      </div>

      <div className={cn('flex flex-1 flex-col p-5 md:p-6', compact && 'p-5')}>
        <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3.25rem] md:min-h-[3.5rem]">
          {course.titulo}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
          {course.descripcion || '\u00A0'}
        </p>

        <div className="flex min-h-[1.375rem] items-center gap-3 mb-4 text-xs md:text-sm text-muted-foreground flex-wrap">
          {course.duracion ? (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
              <span>{course.duracion}</span>
            </div>
          ) : null}
          {course._count?.lecciones ? (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent flex-shrink-0" />
              <span>{course._count.lecciones} lecciones</span>
            </div>
          ) : null}
        </div>

        <div className="mb-4 flex min-h-[1.75rem] items-center gap-2">
          <UserAvatar
            src={course.profesor.avatar}
            name={course.profesor.nombre}
            apellido={course.profesor.apellido}
            size={28}
          />
          <span className="text-sm text-muted-foreground font-medium line-clamp-1">
            {course.profesor.nombre} {course.profesor.apellido}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="font-heading font-bold text-primary text-lg">{priceLabel}</span>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            {purchased ? (
              <Button variant="outline" size="sm" className="text-sm" asChild>
                <Link href={`/estudiante/mis-cursos`}>
                  <Check className="w-4 h-4 mr-1" />
                  Inscrito
                </Link>
              </Button>
            ) : course.es_gratis ? (
              <Button variant="default" size="sm" className="text-sm" asChild>
                <Link href={`/cursos/${course.slug}`}>
                  Ver curso
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant={inCart ? 'outline' : 'default'}
                  size="sm"
                  className="text-sm"
                  onClick={handleAddToCart}
                  disabled={inCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {inCart ? 'En carrito' : 'Agregar'}
                </Button>
                <Button variant="outline" size="sm" className="text-sm hidden sm:inline-flex" asChild>
                  <Link href={`/cursos/${course.slug}`}>Ver</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
