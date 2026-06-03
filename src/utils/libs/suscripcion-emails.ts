import { sendMail } from './mailer'

const PRIMARY = '#25927F'
const FONT = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"

interface DatosSuscripcion {
  nombreUsuario: string
  correoUsuario: string
  nombrePlan: string
  precio: number
  moneda: string
  intervalo: string
  fechaProximoCobro?: Date | null
  cursos?: string[]
}

const simboloMoneda = (moneda: string) => moneda === 'PEN' ? 'S/' : '$'

const intervaloLabel: Record<string, string> = {
  MENSUAL: 'mensual',
  TRIMESTRAL: 'trimestral',
  SEMESTRAL: 'semestral',
  ANUAL: 'anual'
}

function baseTemplate(titulo: string, contenido: string): string {
  return `
    <div style="font-family:${FONT};max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #eee;">
      <div style="background:${PRIMARY};padding:28px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:0.5px;">${titulo}</h1>
      </div>
      <div style="padding:32px;">
        ${contenido}
      </div>
      <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">Si tienes dudas escríbenos. Puedes cancelar tu suscripción en cualquier momento desde tu perfil.</p>
      </div>
    </div>
  `
}

// ─── 1. Suscripción activada ──────────────────────────────────────────────────
export async function enviarEmailSuscripcionActiva(datos: DatosSuscripcion) {
  const { nombreUsuario, correoUsuario, nombrePlan, precio, moneda, intervalo, fechaProximoCobro, cursos = [] } = datos

  const cursosHtml = cursos.length > 0
    ? `<ul style="margin:8px 0 0;padding-left:20px;color:#334155;">${cursos.map(c => `<li style="margin-bottom:4px;">${c}</li>`).join('')}</ul>`
    : ''

  const contenido = `
    <p style="color:#334155;font-size:15px;">Hola <strong>${nombreUsuario}</strong>,</p>
    <p style="color:#334155;font-size:15px;">¡Tu suscripción ha sido activada exitosamente! 🎉</p>

    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">Plan activo</p>
      <p style="margin:0;font-size:22px;font-weight:800;color:#0f172a;">${nombrePlan}</p>
      <p style="margin:4px 0 0;font-size:15px;color:#475569;">${simboloMoneda(moneda)} ${precio.toFixed(2)} / ${intervaloLabel[intervalo] ?? intervalo}</p>
    </div>

    ${cursos.length > 0 ? `
    <p style="color:#475569;font-size:14px;font-weight:600;margin:16px 0 4px;">Cursos incluidos:</p>
    ${cursosHtml}
    ` : ''}

    ${fechaProximoCobro ? `
    <p style="color:#64748b;font-size:13px;margin-top:20px;">
      📅 Próximo cobro: <strong>${fechaProximoCobro.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
    </p>
    ` : ''}

    <div style="margin-top:24px;text-align:center;">
      <a href="${process.env.NEXTAUTH_URL}/estudiante/mis-cursos" style="display:inline-block;background:${PRIMARY};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
        Ver mis cursos →
      </a>
    </div>
  `

  await sendMail({
    to: correoUsuario,
    subject: `✅ Tu suscripción a ${nombrePlan} está activa`,
    html: baseTemplate('SUSCRIPCIÓN ACTIVADA', contenido)
  })
}

// ─── 2. Renovación exitosa ────────────────────────────────────────────────────
export async function enviarEmailRenovacion(datos: DatosSuscripcion) {
  const { nombreUsuario, correoUsuario, nombrePlan, precio, moneda, intervalo, fechaProximoCobro } = datos

  const contenido = `
    <p style="color:#334155;font-size:15px;">Hola <strong>${nombreUsuario}</strong>,</p>
    <p style="color:#334155;font-size:15px;">Tu suscripción se ha renovado correctamente. Seguirás teniendo acceso a todos los cursos del plan.</p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;color:#64748b;font-size:13px;">Plan</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a;font-size:13px;">${nombrePlan}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;font-size:13px;">Monto cobrado</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a;font-size:13px;">${simboloMoneda(moneda)} ${precio.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;font-size:13px;">Frecuencia</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a;font-size:13px;">${intervaloLabel[intervalo] ?? intervalo}</td>
        </tr>
        ${fechaProximoCobro ? `
        <tr>
          <td style="padding:6px 0;color:#64748b;font-size:13px;">Próxima renovación</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a;font-size:13px;">${fechaProximoCobro.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `

  await sendMail({
    to: correoUsuario,
    subject: `🔄 Tu suscripción a ${nombrePlan} se renovó correctamente`,
    html: baseTemplate('RENOVACIÓN EXITOSA', contenido)
  })
}

// ─── 3. Cobro fallido ─────────────────────────────────────────────────────────
export async function enviarEmailCobroFallido(datos: DatosSuscripcion & { intentos: number }) {
  const { nombreUsuario, correoUsuario, nombrePlan, intentos } = datos

  const urgente = intentos >= 2
  const contenido = `
    <p style="color:#334155;font-size:15px;">Hola <strong>${nombreUsuario}</strong>,</p>
    <p style="color:#334155;font-size:15px;">No pudimos procesar el cobro de tu suscripción <strong>${nombrePlan}</strong>.</p>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#dc2626;font-weight:600;">
        ${urgente
          ? '⚠️ Último intento. Si el cobro falla nuevamente, tu suscripción será cancelada.'
          : '⚠️ Reintentaremos el cobro en los próximos días.'
        }
      </p>
    </div>

    <p style="color:#475569;font-size:14px;">Para evitar perder el acceso a tus cursos, te recomendamos:</p>
    <ul style="color:#475569;font-size:14px;">
      <li>Verificar que tu tarjeta tenga fondos suficientes</li>
      <li>Actualizar los datos de tu tarjeta si venció</li>
    </ul>

    <div style="margin-top:24px;text-align:center;">
      <a href="${process.env.NEXTAUTH_URL}/estudiante/suscripcion" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
        Gestionar mi suscripción →
      </a>
    </div>
  `

  await sendMail({
    to: correoUsuario,
    subject: `⚠️ Problema con el cobro de tu suscripción ${nombrePlan}`,
    html: baseTemplate('COBRO FALLIDO', contenido)
  })
}

// ─── 4. Suscripción cancelada ─────────────────────────────────────────────────
export async function enviarEmailSuscripcionCancelada(datos: DatosSuscripcion) {
  const { nombreUsuario, correoUsuario, nombrePlan } = datos

  const contenido = `
    <p style="color:#334155;font-size:15px;">Hola <strong>${nombreUsuario}</strong>,</p>
    <p style="color:#334155;font-size:15px;">Tu suscripción a <strong>${nombrePlan}</strong> ha sido cancelada.</p>
    <p style="color:#64748b;font-size:14px;">Has perdido el acceso a los cursos del plan. Si cambiaste de opinión, puedes reactivarla en cualquier momento.</p>

    <div style="margin-top:24px;text-align:center;">
      <a href="${process.env.NEXTAUTH_URL}/suscripciones" style="display:inline-block;background:${PRIMARY};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
        Ver planes disponibles →
      </a>
    </div>
  `

  await sendMail({
    to: correoUsuario,
    subject: `Tu suscripción a ${nombrePlan} ha sido cancelada`,
    html: baseTemplate('SUSCRIPCIÓN CANCELADA', contenido)
  })
}
