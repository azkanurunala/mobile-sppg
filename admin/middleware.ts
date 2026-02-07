import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // 1. Handle Root Redirect
  if (pathname === '/') {
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (e) {
        // Token invalid, proceed to login
      }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Protect Admin and API Docs
  if (pathname.startsWith('/admin') || pathname.startsWith('/api-docs')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Admin route protection
      if (pathname.startsWith('/admin')) {
        const role = payload.role as string;
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
          // Redirect to unauthorized or back to home if not admin
          return NextResponse.redirect(new URL('/login?error=Unauthorized', request.url));
        }
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/api-docs/:path*',
  ],
};
