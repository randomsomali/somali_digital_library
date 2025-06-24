// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define supported locales
const supportedLocales = ['en', 'ar']
const defaultLocale = 'ar' // Arabic as default

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if pathname already has a locale
    const pathnameHasLocale = supportedLocales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) {
        // Get locale from path
        const locale = pathname.split('/')[1];
        const pathWithoutLocale = pathname.replace(`/${locale}`, '');

        // Set lang and dir attributes
        const response = NextResponse.next();
        response.headers.set('x-lang', locale);
        response.headers.set('x-dir', locale === 'ar' ? 'rtl' : 'ltr');

        return response;
    }

    // Get locale from cookie if available
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

    // Get locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || ''
    const preferredLocale = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].split('-')[0])
        .find(lang => supportedLocales.includes(lang))

    // Use cookie locale, then header locale, then default
    const locale = cookieLocale && supportedLocales.includes(cookieLocale)
        ? cookieLocale
        : preferredLocale || defaultLocale

    // Redirect to the locale version
    return NextResponse.redirect(
        new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    )
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)']
}