'use client'

import { useRef, useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const ReclamacionesBadge = () => {
  const [count, setCount] = useState(0)
  const router = useRouter()
  const { data: session } = useSession()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/admin/reclamaciones/pendientes')
      const data = await res.json()

      if (typeof data.count === 'number') {
        setCount(data.count)
      }
    } catch (err) {
      console.error('Error fetching reclamaciones count:', err)
    }
  }

  useEffect(() => {
    if (session?.user?.rol !== 'ADMIN') return

    fetchCount()
    intervalRef.current = setInterval(fetchCount, 30000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [session?.user?.rol])

  if (session?.user?.rol !== 'ADMIN') return null

  return (
    <Tooltip title={count > 0 ? `${count} reclamación(es) pendiente(s)` : 'Libro de Reclamaciones'}>
      <IconButton
        onClick={() => router.push('/admin/reclamaciones')}
        className='text-textPrimary'
      >
        <Badge badgeContent={count} color='error'>
          <i className='tabler-book-2 text-[22px]' />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}

export default ReclamacionesBadge
