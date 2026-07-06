'use client'

import { useState } from 'react'

import { Box, Menu, MenuItem } from '@mui/material'

export type CatalogFilterOption = {
  value: string
  label: string
  disabled?: boolean
}

type CatalogFilterSelectProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder: string
  active?: boolean
  iconClass: string
  minWidth?: number
  getLabel: (value: string) => string
  variant?: 'default' | 'sort'
  options: CatalogFilterOption[]
}

export function CatalogFilterSelect({
  value,
  onChange,
  disabled = false,
  placeholder,
  active = false,
  iconClass,
  minWidth = 160,
  getLabel,
  variant = 'default',
  options,
}: CatalogFilterSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const isSort = variant === 'sort'

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setAnchorEl(null)
  }

  const displayLabel = value ? getLabel(value) : placeholder

  return (
    <Box sx={{ position: 'relative', flexShrink: 0 }}>
      <Box
        component="button"
        type="button"
        disabled={disabled}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          minWidth,
          flexShrink: 0,
          borderRadius: '16px',
          border: '1.5px solid',
          borderColor: isSort ? '#e2e8f0' : active ? 'var(--mui-palette-primary-main)' : 'transparent',
          bgcolor: isSort ? '#ffffff' : active ? 'primary.50' : '#f8fafc',
          color: active || isSort ? 'primary.main' : 'inherit',
          px: 1.25,
          py: 0.875,
          boxShadow: isSort ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
          transition: 'all 0.2s ease',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          fontFamily: 'inherit',
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: 1.2,
          '&:hover': disabled
            ? {}
            : isSort
              ? { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
              : { bgcolor: active ? 'primary.50' : '#f1f5f9' },
        }}
      >
        <i
          className={iconClass}
          style={{
            color: active || isSort ? 'var(--mui-palette-primary-main)' : '#64748b',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        />
        <Box component="span" sx={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>
          {displayLabel}
        </Box>
        <i
          className={open ? 'tabler-chevron-up' : 'tabler-chevron-down'}
          style={{ fontSize: '1rem', flexShrink: 0, opacity: 0.7 }}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        disablePortal
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 320,
              mt: 0.5,
              minWidth: anchorEl?.offsetWidth ?? minWidth,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value || '__all__'}
            selected={value === option.value}
            disabled={option.disabled}
            onClick={() => {
              if (!option.disabled) handleSelect(option.value)
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
