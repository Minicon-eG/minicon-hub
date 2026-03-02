import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  console.log('Middleware debug:', hostname, url.pathname);

  // Skip middleware for /database
  if (url.pathname.startsWith('/database')) {
    return NextResponse.next();
  }

  // Clean hostname (remove port if present)
  const domain = hostname.split(':')[0];

  // If it's the main hub or localhost, serve the main app
  if (domain === 'hub.minicon.eu' || domain === 'localhost') {
    return NextResponse.next();
  }

  // If it's a subdomain (e.g. pizzeria-ischia.minicon.eu)
  if (domain.endsWith('.minicon.eu')) {
    const subdomain = domain.replace('.minicon.eu', '');
    
    // Rewrite the request to /sites/[subdomain]
    // The original path is preserved (e.g. /menu -> /sites/pizzeria-ischia/menu)
    url.pathname = `/sites/${subdomain}${url.pathname}`;
    console.log('Rewriting to:', url.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
