"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Newspaper, Image as ImageIcon, Calendar, Settings, LogOut, Tag, MessageSquare, Building2, FolderOpen } from "lucide-react"

const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Warta & Publikasi", href: "/admin/news", icon: Newspaper },
    { name: "Kategori Berita", href: "/admin/categories", icon: Tag },
    { name: "Arsip Pergerakan", href: "/admin/gallery", icon: ImageIcon },
    { name: "Repositori Dokumen", href: "/admin/documents", icon: FolderOpen },
    { name: "Agenda Kegiatan", href: "/admin/agenda", icon: Calendar },
    { name: "Pesan Masuk", href: "/admin/messages", icon: MessageSquare },
    { name: "Kategori Pesan", href: "/admin/message-categories", icon: Tag },
    { name: "Profil Organisasi", href: "/admin/organization", icon: Building2 },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
]

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-background h-screen flex flex-col border-r border-border">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.svg"
                        alt="Logo BEM Pesantren Indonesia"
                        width={36}
                        height={36}
                        className="rounded-lg flex-shrink-0"
                    />
                    <div>
                        <h3 className="font-bold text-sm leading-tight">Admin BEM Pesantren Indonesia</h3>
                    </div>
                </div>
            </div>
            <Separator className="bg-border" />

            <ScrollArea className="flex-1 py-6 px-4">
                <div className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 mb-1",
                                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                                        ? " hover:bg-primary/90"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </ScrollArea>

            <Separator className="bg-border" />
            <div className="p-4">
                <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="w-5 h-5" />
                    Keluar
                </Button>
            </div>
        </div>
    )
}

