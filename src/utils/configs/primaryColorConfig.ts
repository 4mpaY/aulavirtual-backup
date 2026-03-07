export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    light: process.env.NEXT_PUBLIC_PRIMARY_COLOR_LIGHT || '#88c7e7',
    main: process.env.NEXT_PUBLIC_PRIMARY_COLOR_MAIN || '#1178ac',
    dark: process.env.NEXT_PUBLIC_PRIMARY_COLOR_DARK || '#0d5c85'
  },
  {
    name: 'primary-2',
    light: '#4EB0B1',
    main: '#0D9394',
    dark: '#096B6C'
  },
  {
    name: 'primary-3',
    light: '#FFC25A',
    main: '#FFAB1D',
    dark: '#BA7D15'
  },
  {
    name: 'primary-4',
    light: '#F0718D',
    main: '#EB3D63',
    dark: '#AC2D48'
  },
  {
    name: 'primary-5',
    light: '#5CAFF1',
    main: '#2092EC',
    dark: '#176BAC'
  }
]

export default primaryColorConfig
