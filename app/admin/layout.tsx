"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { SessionProvider, useSession } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminLayoutSkeleton } from "@/components/admin/layout-skeleton"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return <AdminLayoutSkeleton />
    }

    if (!session) {
        return null
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 font-sans">
            {/* Sidebar wrapper if needed, assume Sidebar is self-contained */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <AdminLayoutContent>{children}</AdminLayoutContent>
            </ThemeProvider>
        </SessionProvider>
    );
}
