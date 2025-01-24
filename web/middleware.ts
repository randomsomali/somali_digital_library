import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const defaultLocale = 'ar' // Setting Arabic as default for Saudi website

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Get preferred language from header or default to Arabic
    const preferredLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || defaultLocale

    // Check if pathname starts with a locale
    if (pathname === '/' || !pathname.startsWith('/ar') && !pathname.startsWith('/en')) {
        // Redirect to preferred locale or default
        return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}