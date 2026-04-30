import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const configs = [
    {
      clave: 'TEMPLATE_NAME',
      valor: process.env.NEXT_PUBLIC_TEMPLATE_NAME || 'Aula Virtual',
      descripcion: 'Nombre de la plataforma'
    },
    {
      clave: 'TEMPLATE_SLOGAN',
      valor: process.env.NEXT_PUBLIC_TEMPLATE_SLOGAN || 'Aprende con nosotros',
      descripcion: 'Slogan de la plataforma'
    },
    {
      clave: 'TEMPLATE_LOGO',
      valor: process.env.NEXT_PUBLIC_TEMPLATE_LOGO || '/images/logo.png',
      descripcion: 'URL del logo de la plataforma'
    },
    {
      clave: 'SETTINGS_COOKIE_NAME',
      valor: process.env.NEXT_PUBLIC_SETTINGS_COOKIE_NAME || 'arm',
      descripcion: 'Nombre de la cookie de configuración'
    },
    {
      clave: 'PRIMARY_COLOR_MAIN',
      valor: process.env.NEXT_PUBLIC_PRIMARY_COLOR_MAIN || '#131FF2',
      descripcion: 'Color primario principal'
    },
    {
      clave: 'PRIMARY_COLOR_LIGHT',
      valor: process.env.NEXT_PUBLIC_PRIMARY_COLOR_LIGHT || '#242CBF',
      descripcion: 'Color primario claro'
    },
    {
      clave: 'PRIMARY_COLOR_DARK',
      valor: process.env.NEXT_PUBLIC_PRIMARY_COLOR_DARK || '#9196F2',
      descripcion: 'Color primario oscuro'
    },
    {
      clave: 'PAYPAL_CLIENT_ID',
      valor: process.env.PAYPAL_CLIENT_ID || '',
      descripcion: 'ID de cliente de PayPal (Servidor)'
    },
    {
      clave: 'PAYPAL_CLIENT_SECRET',
      valor: process.env.PAYPAL_CLIENT_SECRET || '',
      descripcion: 'Secreto de cliente de PayPal'
    },
    {
      clave: 'PAYPAL_API_URL',
      valor: process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com',
      descripcion: 'URL de la API de PayPal'
    },
    {
      clave: 'PAYPAL_PUBLIC_CLIENT_ID',
      valor: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      descripcion: 'ID de cliente público de PayPal (Frontend)'
    },
    { clave: 'GOOGLE_CLIENT_ID', valor: process.env.GOOGLE_CLIENT_ID || '', descripcion: 'ID de cliente de Google' },
    {
      clave: 'GOOGLE_CLIENT_SECRET',
      valor: process.env.GOOGLE_CLIENT_SECRET || '',
      descripcion: 'Secreto de cliente de Google'
    },
    {
      clave: 'IZIPAY_MERCHANT_CODE',
      valor: process.env.IZIPAY_MERCHANT_CODE || '',
      descripcion: 'Código de comercio de Izipay'
    },
    { clave: 'IZIPAY_API_KEY', valor: process.env.IZIPAY_API_KEY || '', descripcion: 'API Key de Izipay' },
    { clave: 'IZIPAY_RSA_KEY', valor: process.env.IZIPAY_RSA_KEY || '', descripcion: 'RSA Key de Izipay' },
    {
      clave: 'IZIPAY_ENDPOINT',
      valor: process.env.IZIPAY_ENDPOINT || 'https://sandbox-api-pw.izipay.pe',
      descripcion: 'Endpoint de Izipay'
    },
    {
      clave: 'IZIPAY_SDK_URL',
      valor: process.env.NEXT_PUBLIC_IZIPAY_SDK_URL || 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js',
      descripcion: 'URL del SDK de Izipay'
    }
  ]

  console.log('Iniciando siembra de configuraciones...')

  for (const config of configs) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: { valor: config.valor, descripcion: config.descripcion },
      create: config
    })
    console.log(`Configuración síncronizada: ${config.clave}`)
  }

  console.log('Siembra de configuraciones completada.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
