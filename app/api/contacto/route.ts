import { generateCsrfToken, verifyCsrfToken } from '@/lib/csrf';

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import dns from 'dns'
import { promisify } from 'util'


const resolveMx = promisify(dns.resolveMx)

// ========== LISTA DE DOMINIOS TEMPORALES ==========
const DOMINIOS_TEMPORALES = [
  'mailinator.com', 'guerrillamail.com', '10minutemail.com',
  'tempmail.com', 'throwawaymail.com', 'dispostable.com',
  'fakeinbox.com', 'spamgourmet.com', 'trashmail.com',
  'guerrillamail.org', 'mailnator.com', 'temp-mail.org',
  'yopmail.com', 'getnada.com', 'mohmal.com',
]

// ========== VALIDACIÓN 1: FORMATO ==========
function validarFormatoEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ========== VALIDACIÓN 2: DOMINIO VÁLIDO ==========
async function validarDominio(email: string): Promise<{ valido: boolean; mensaje?: string }> {
  try {
    const dominio = email.split('@')[1]
    if (!dominio) {
      return { valido: false, mensaje: 'El email no tiene un dominio válido' }
    }

    const mxRecords = await resolveMx(dominio)
    if (!mxRecords || mxRecords.length === 0) {
      return {
        valido: false,
        mensaje: `El dominio "${dominio}" no existe o no puede recibir correos`
      }
    }

    return { valido: true }
  } catch {
    return {
      valido: false,
      mensaje: 'El dominio del email no es válido o no existe'
    }
  }
}

// ========== VALIDACIÓN 3: CUENTA EXISTENTE ==========
async function validarCuenta(email: string, mensaje: string): Promise<{ valido: boolean; mensaje?: string }> {
  try {
    console.log(`🔍 Verificando cuenta: ${email}`)

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    })

    const validacionHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación - Tapetes Hnos. Flores</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f5f0eb;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 45px 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(196, 154, 108, 0.15);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #c49a6c;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #c49a6c;
            font-size: 28px;
            margin: 0;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .header p {
            color: #8B7355;
            margin: 5px 0 0;
            font-size: 14px;
          }
          .content {
            color: #2c1810;
            line-height: 1.8;
          }
          .content .saludo {
            font-size: 20px;
            font-weight: 600;
            color: #2c1810;
            margin-bottom: 16px;
          }
          .content p {
            color: #4a3a2a;
            margin-bottom: 16px;
          }
          .mensaje-recibido {
            background: #f9f6f2;
            padding: 18px 20px;
            border-radius: 10px;
            border-left: 4px solid #c49a6c;
            margin: 20px 0;
          }
          .mensaje-recibido p {
            margin: 0;
            color: #4a3a2a;
            font-style: italic;
          }
          .contacto-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin: 25px 0 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            text-align: center;
            flex: 1 1 auto;
          }
          .button-whatsapp {
            background: #25D366;
            color: white;
          }
          .button-whatsapp:hover {
            background: #1da851;
          }
          .button-phone {
            background: #c49a6c;
            color: white;
          }
          .button-phone:hover {
            background: #a5784a;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e8e0d8;
            text-align: center;
            color: #8B7355;
            font-size: 13px;
          }
          .footer p {
            margin: 4px 0;
          }
          .footer .direccion {
            font-size: 12px;
            color: #b8a99a;
          }
          @media (max-width: 480px) {
            .container { padding: 24px 20px; }
            .header h1 { font-size: 22px; }
            .contacto-buttons { flex-direction: column; }
            .button { width: 100%; text-align: center; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧶 Tapetes Hnos. Flores</h1>
            <p>Confirmación de contacto</p>
          </div>
          <div class="content">
            <p class="saludo">¡Gracias por contactarnos! 👋</p>
            <p>Hemos recibido tu mensaje y en breve nos pondremos en contacto contigo para atender tu solicitud.</p>
            <div class="mensaje-recibido">
              <p><strong>📝 Tu mensaje:</strong><br>${mensaje}</p>
            </div>
            <p style="margin-top: 20px;"><strong>📞 ¿Necesitas atención inmediata?</strong><br>
            Contáctanos directamente por WhatsApp o llámanos:</p>
            <div class="contacto-buttons">
              <a href="https://wa.me/525538788046?text=Hola,%20me%20comunico%20por%20el%20mensaje%20que%20envié%20en%20la%20página%20web" class="button button-whatsapp">📱 WhatsApp</a>
              <a href="tel:5538788046" class="button button-phone">📞 55 3878-8046</a>
            </div>
            <p style="font-size: 14px; color: #6b5843; margin-top: 10px;">
              Estamos a tus órdenes de <strong>Lunes a Viernes 9am - 6pm</strong> y <strong>Sábados 9am - 2pm</strong>.
            </p>
          </div>
          <div class="footer">
            <p>🧶 Tapetes Hermanos Flores</p>
            <p class="direccion">📍 Alcaldía Iztapalapa #6, CDMX</p>
            <p style="font-size: 11px; color: #b8a99a; margin-top: 8px;">
              Este es un correo automático de confirmación.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: '✅ Confirmación de contacto - Tapetes Hnos. Flores',
      html: validacionHtml,
    })

    console.log(`✅ Correo de confirmación enviado a ${email}: ${info.messageId}`)
    return { valido: true }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.log(`❌ Error al verificar ${email}:`, errorMessage)

    if (errorMessage.includes('Address not found') ||
        errorMessage.includes('User unknown') ||
        errorMessage.includes('Recipient address rejected') ||
        errorMessage.includes('550') ||
        errorMessage.includes('Invalid recipient') ||
        errorMessage.includes('Mailbox unavailable') ||
        errorMessage.includes('No such user')) {
      return {
        valido: false,
        mensaje: `El correo "${email}" no existe o no es válido. Por favor, verifica tu dirección de correo.`
      }
    }

    return {
      valido: true,
      mensaje: 'No se pudo verificar la cuenta, pero intentaremos enviar tu mensaje.'
    }
  }
}

// ========== VALIDACIÓN 4: CORREO TEMPORAL ==========
function validarNoTemporal(email: string): { valido: boolean; mensaje?: string } {
  const dominio = email.split('@')[1].toLowerCase()
  if (DOMINIOS_TEMPORALES.includes(dominio)) {
    return {
      valido: false,
      mensaje: `No se permiten correos temporales o desechables (${dominio}). Por favor, usa tu correo personal o empresarial.`
    }
  }
  return { valido: true }
}

export async function POST(request: NextRequest) {
  try {
    // ================================================================
    // 🔒 VERIFICACIÓN CSRF - DEBE SER LO PRIMERO
    // ================================================================
    const token = request.headers.get('x-csrf-token');
    if (!token || !verifyCsrfToken(token)) {
      return NextResponse.json({ 
        success: false,
        error: 'CSRF token inválido' 
      }, { status: 403 });
    }
    // ================================================================
    
    const body = await request.json()
    const { nombre, email, telefono, mensaje } = body

    console.log('📩 Datos recibidos:', { nombre, email, telefono, mensaje })

    // ========== VALIDACIONES BÁSICAS ==========
    if (!nombre || nombre.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'El nombre debe tener al menos 2 caracteres'
      }, { status: 400 })
    }

    if (!mensaje || mensaje.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'El mensaje debe tener al menos 10 caracteres'
      }, { status: 400 })
    }

    // ========== VALIDACIÓN 1: FORMATO ==========
    if (!validarFormatoEmail(email)) {
      return NextResponse.json({
        success: false,
        error: 'Email inválido. Debe tener el formato: ejemplo@correo.com'
      }, { status: 400 })
    }

    // ========== VALIDACIÓN 4: CORREO TEMPORAL ==========
    const noTemporal = validarNoTemporal(email)
    if (!noTemporal.valido) {
      return NextResponse.json({
        success: false,
        error: noTemporal.mensaje
      }, { status: 400 })
    }

    // ========== VALIDACIÓN 2: DOMINIO ==========
    const dominioValido = await validarDominio(email)
    if (!dominioValido.valido) {
      return NextResponse.json({
        success: false,
        error: dominioValido.mensaje || 'El dominio del email no es válido'
      }, { status: 400 })
    }

    // ========== VALIDACIÓN 3: CUENTA EXISTENTE ==========
    const cuentaValida = await validarCuenta(email, mensaje)
    if (!cuentaValida.valido) {
      return NextResponse.json({
        success: false,
        error: cuentaValida.mensaje || 'La cuenta de correo no es válida'
      }, { status: 400 })
    }

    // ========== CONFIGURAR TRANSPORTER ==========
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    })

    // ========== CORREO PARA EL NEGOCIO ==========
    const negocioHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f0eb; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .header { text-align: center; border-bottom: 3px solid #c49a6c; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #c49a6c; font-size: 28px; margin: 0; font-weight: 700; }
          .header p { color: #8B7355; margin: 5px 0 0; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #2c1810; font-size: 14px; display: block; margin-bottom: 4px; }
          .value { color: #4a3a2a; font-size: 16px; background: #f9f6f2; padding: 10px 14px; border-radius: 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8e0d8; text-align: center; color: #8B7355; font-size: 13px; }
          .badge { display: inline-block; background: #c49a6c; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧶 Tapetes Hnos. Flores</h1>
            <p>Nuevo mensaje de contacto</p>
          </div>
          <div class="field">
            <span class="label">👤 Nombre</span>
            <div class="value">${nombre}</div>
          </div>
          <div class="field">
            <span class="label">📧 Email</span>
            <div class="value">${email}</div>
          </div>
          ${telefono ? `<div class="field"><span class="label">📞 Teléfono</span><div class="value">${telefono}</div></div>` : ''}
          <div class="field">
            <span class="label">💬 Mensaje</span>
            <div class="value">${mensaje}</div>
          </div>
          <div class="footer">
            <span class="badge">NUEVO</span>
            <p style="margin-top: 10px;">Este mensaje fue enviado desde el sitio web</p>
          </div>
        </div>
      </body>
      </html>
    `

    // ========== CORREO DE CONFIRMACIÓN PARA EL CLIENTE ==========
    const clienteHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f0eb; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 45px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .header { text-align: center; border-bottom: 3px solid #c49a6c; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #c49a6c; font-size: 28px; margin: 0; }
          .content { color: #2c1810; line-height: 1.8; }
          .content .saludo { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
          .mensaje-recibido { background: #f9f6f2; padding: 18px 20px; border-radius: 10px; border-left: 4px solid #c49a6c; margin: 20px 0; }
          .mensaje-recibido p { margin: 0; color: #4a3a2a; font-style: italic; }
          .contacto-buttons { display: flex; flex-wrap: wrap; gap: 12px; margin: 25px 0 10px; }
          .button { display: inline-block; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 14px; flex: 1 1 auto; text-align: center; }
          .button-whatsapp { background: #25D366; color: white; }
          .button-whatsapp:hover { background: #1da851; }
          .button-phone { background: #c49a6c; color: white; }
          .button-phone:hover { background: #a5784a; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8e0d8; text-align: center; color: #8B7355; font-size: 13px; }
          .footer .direccion { font-size: 12px; color: #b8a99a; }
          @media (max-width: 480px) {
            .container { padding: 24px 20px; }
            .contacto-buttons { flex-direction: column; }
            .button { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>🧶 Tapetes Hnos. Flores</h1></div>
          <div class="content">
            <p class="saludo">¡Gracias por contactarnos! 👋</p>
            <p>Hemos recibido tu mensaje y en breve nos pondremos en contacto contigo para atender tu solicitud.</p>
            <div class="mensaje-recibido">
              <p><strong>📝 Tu mensaje:</strong><br>${mensaje}</p>
            </div>
            <p style="margin-top: 20px;"><strong>📞 ¿Necesitas atención inmediata?</strong><br>Contáctanos directamente por WhatsApp o llámanos:</p>
            <div class="contacto-buttons">
              <a href="https://wa.me/525538788046?text=Hola,%20me%20comunico%20por%20el%20mensaje%20que%20envi%C3%A9%20en%20la%20p%C3%A1gina%20web" class="button button-whatsapp">📱 WhatsApp</a>
              <a href="tel:5538788046" class="button button-phone">📞 55 3878-8046</a>
            </div>
            <p style="font-size: 14px; color: #6b5843; margin-top: 10px;">
              Estamos a tus órdenes de <strong>Lunes a Viernes 9am - 6pm</strong> y <strong>Sábados 9am - 2pm</strong>.
            </p>
          </div>
          <div class="footer">
            <p>🧶 Tapetes Hermanos Flores</p>
            <p class="direccion">📍 Alcaldía Iztapalapa #6, CDMX</p>
            <p style="font-size: 11px; color: #b8a99a; margin-top: 8px;">Este es un correo automático de confirmación.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // ========== ENVIAR CORREO AL NEGOCIO ==========
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'lavadodetapeteshnozfloresflore@gmail.com',
      subject: `📩 Nuevo mensaje de ${nombre}`,
      html: negocioHtml,
    })

    // ========== ENVIAR CORREO DE CONFIRMACIÓN AL CLIENTE ==========
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `✅ Confirmación de contacto - Tapetes Hnos. Flores`,
      html: clienteHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente. Te contactaremos pronto.'
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('❌ Error al enviar email:', errorMessage)
    return NextResponse.json({
      success: false,
      error: 'Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.'
    }, { status: 500 })
  }
}
