import PageHeader from '@/utils/components/layout/web/PageHeader'

import { ContactList, ContactActions } from './components/ContactoClient'

export const metadata = {
  title: 'Contacto - SSMAT',
  description: 'Ponte en contacto con nosotros. Estamos para ayudarte.',
}

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        label="Estamos aquí para ayudarte"
        title="Ponte en Contacto"
        description="Contáctanos por cualquiera de estos medios y te responderemos a la brevedad."
        imageSrc="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Cards + CTA */}
      <section style={{ backgroundColor: 'var(--web-bg, #eef7f4)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          <ContactList />

          <ContactActions />
        </div>
      </section>
    </>
  )
}
