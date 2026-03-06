"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, Search } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/toggle-theme"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationMenu } from "./notification-menu"

export function AdminHeader() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOut({ redirect: false })
            toast.success("Berhasil keluar")
            router.push("/login")
        } catch {
            toast.error("Gagal keluar, silakan coba lagi")
            setIsLoggingOut(false)
        }
    }

    const userName = session?.user?.name || "Administrator"
    const userEmail = session?.user?.email || ""
    const initials = userName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2" />
                <div>
                    <h2 className="font-bold  dark:text-gray-200 hidden md:block">Selamat Datang, {userName.split(" ")[0]}</h2>
                    <p className="text-xs  hidden md:block">{userEmail}</p>
                </div>
            </div>

            {/* Global Search */}
            <form
                action="/admin/search"
                method="GET"
                className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-6"
            >
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 " />
                    <Input
                        name="q"
                        placeholder="Cari konten..."
                        className="pl-9 h-8 text-sm bg-muted"
                    />
                </div>
            </form>

            <div className="flex items-center gap-4">
                <ModeToggle />

                <NotificationMenu />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 py-1 h-auto hover:bg-accent rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} alt={userName} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium  dark:text-gray-200">{userName}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userName}</p>
                                <p className="text-xs leading-none ">{userEmail}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings" className="w-full cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings?tab=preferences" className="w-full cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Pengaturan
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/10"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoggingOut ? "Keluar..." : "Keluar"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header >
    )
}

