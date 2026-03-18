import prisma from '../src/utils/libs/prisma'

async function check() {
  const dts = require('fs').readFileSync('node_modules/.prisma/client/index.d.ts', 'utf8')
  if (dts.includes('tipo?: string | null') && dts.includes('enlace?: string | null')) {
    console.log('FIELDS tipo AND enlace ARE IN D.TS')
  } else {
    console.log('FIELDS NOT FOUND in D.TS')
    // Let's print a small snippet of the Notificacion type
    const match = dts.match(/export type Notificacion = {[\s\S]*?}/)
    if (match) console.log(match[0])
  }
  process.exit(0)
}

check()
