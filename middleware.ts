import { type NextRequest, NextResponse } from 'next/server';

// Middleware is intentionally minimal for demo/hackathon mode.
// Supabase auth integration is optional — all routes are accessible.
// For production, replace with full auth middleware from lib/supabase/middleware.ts
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
