// Middleware temporarily disabled due to Edge runtime compatibility issues with NextAuth v5 beta
// Route protection is handled in app/admin/layout.tsx instead
export { auth as middleware } from "@/lib/auth"

export const config = {
    matcher: []  // Disabled for now
}
