import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================
// RATE LIMITING EN MEMORIA
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitInfo(ip: string) {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  // Si no hay registro o ya expiró, crear uno nuevo
  if (!record || now > record.resetAt) {
    const newRecord = { 
      count: 1, 
      resetAt: now + 60000 // 1 minuto
    }
    rateLimitMap.set(ip, newRecord)
    return { allowed: true, remaining: 9 }
  }
  
  // Si supera el límite (10 solicitudes por minuto)
  if (record.count >= 10) {
    return { allowed: false, remaining: 0 }
  }
  
  // Incrementar contador
  record.count++
  return { allowed: true, remaining: 10 - record.count }
}

// ============================================================
// LISTA DE BOTS MALICIOSOS
// ============================================================
const MALICIOUS_AGENTS = [
  'sqlmap',
  'nmap',
  'nikto',
  'wpscan',
  'dirb',
  'gobuster',
  'hydra',
  'medusa',
  'ncrack',
  'thc-hydra',
  'burpsuite',
  'zap',
  'wfuzz',
  'ffuf',
  'masscan',
  'rustscan',
  'nuclei',
  'metasploit',
  'arachni',
  'openvas',
  'nessus',
  'acunetix',
  'appscan',
  'netsparker',
  'w3af',
  'skipfish',
  'vega',
  'ratproxy',
  'mimikatz',
  'mimipenguin',
  'lazagne',
  'pwdump',
  'fgdump',
  'winlogon',
  'lsass',
  'creddump',
  'hashcat',
  'john',
  'aircrack',
  'reaver',
  'bully',
  'pixiewps',
  'wash',
  'kismet',
  'airodump',
  'mdk3',
  'mdk4',
  'bettercap',
  'ettercap',
  'wireshark',
  'tcpdump',
  'nmap'
]

// ============================================================
// MIDDLEWARE PRINCIPAL
// ============================================================
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // ============================================================
  // 1. RATE LIMITING PARA API
  // ============================================================
  if (pathname.startsWith('/api/')) {
    const rateLimit = getRateLimitInfo(ip)
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Demasiadas solicitudes. Intenta en 1 minuto.',
          retryAfter: 60
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + 60000)
          }
        }
      )
    }
    
    // Agregar headers de rate limiting en la respuesta
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', '10')
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
    response.headers.set('X-RateLimit-Reset', String(Date.now() + 60000))
    return response
  }
  
  // ============================================================
  // 2. REDIRIGIR HTTP A HTTPS (PRODUCCIÓN)
  // ============================================================
  if (process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto')
    if (protocol !== 'https') {
      const url = request.nextUrl.clone()
      url.protocol = 'https'
      return NextResponse.redirect(url, 301)
    }
  }
  
  // ============================================================
  // 3. BLOQUEAR BOTS MALICIOSOS
  // ============================================================
  const userAgent = request.headers.get('user-agent') || ''
  const isMalicious = MALICIOUS_AGENTS.some(agent => 
    userAgent.toLowerCase().includes(agent)
  )
  
  if (isMalicious) {
    console.log(`🛡️ Bloqueado bot malicioso: ${userAgent} - IP: ${ip}`)
    return new NextResponse('Acceso denegado', { status: 403 })
  }
  
  // ============================================================
  // 4. AGREGAR HEADERS DE SEGURIDAD ADICIONALES
  // ============================================================
  const response = NextResponse.next()
  
  // Prevenir que los navegadores realicen MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Prevenir ataques XSS
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  return response
}

// ============================================================
// CONFIGURACIÓN DEL MIDDLEWARE
// ============================================================
export const config = {
  matcher: [
    '/api/:path*',    // Para todas las rutas de API
    '/:path*'         // Para todas las rutas
  ],
}
