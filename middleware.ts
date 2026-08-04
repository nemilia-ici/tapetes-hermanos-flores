import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Rate limiting básico (para API)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  // En producción, usar Redis o base de datos para rate limiting

  // 2. Redirigir HTTP a HTTPS (en producción)
  if (process.env.NODE_ENV === 'production' && !request.nextUrl.protocol?.startsWith('https')) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    )
  }

  // 3. Bloquear requests maliciosos (ejemplo)
  const userAgent = request.headers.get('user-agent') || ''
  const blockedAgents = ['bot', 'crawler', 'spider']
  if (blockedAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
    // En producción, podrías bloquear o devolver 403
    // return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/:path*'],
}
