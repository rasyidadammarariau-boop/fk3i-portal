import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware is currently disabled/bypassed to avoid Edge Runtime size limits with Prisma
// Auth protection is handled in layout files (e.g. app/admin/layout.tsx)
export function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: []
}
