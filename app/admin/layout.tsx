"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AdminHeader } from "@/components/admin/header"
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminLayoutSkeleton } from "@/components/admin/layout-skeleton"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

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
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-muted/20">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SessionProvider>
    );
}

