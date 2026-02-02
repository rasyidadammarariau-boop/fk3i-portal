"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Newspaper, Image as ImageIcon, Calendar, Settings, LogOut, Tag, MessageSquare, Building2 } from "lucide-react"

const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Berita & Artikel", href: "/admin/news", icon: Newspaper },
    { name: "Kategori Berita", href: "/admin/categories", icon: Tag },
    { name: "Galeri Foto", href: "/admin/gallery", icon: ImageIcon },
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
        <div className="w-64 bg-slate-900 h-screen text-white flex flex-col border-r border-slate-800">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">
                        F
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">Admin FK3i</h3>
                    </div>
                </div>
            </div>
            <Separator className="bg-slate-800" />

            <ScrollArea className="flex-1 py-6 px-4">
                <div className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 mb-1",
                                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </ScrollArea>

            <Separator className="bg-slate-800" />
            <div className="p-4">
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <LogOut className="w-5 h-5" />
                    Keluar
                </Button>
            </div>
        </div>
    )
}
