"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Settings,
} from "lucide-react"
import { getUnreadMessagesCount } from "@/app/admin/messages/unread-count"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [unreadCount, setUnreadCount] = React.useState(0)

  React.useEffect(() => {
    getUnreadMessagesCount().then(setUnreadCount).catch(() => { })
  }, [])

  useSession()

  // Menggunakan nested items agar NavMain me-render fitur Collapsible dari Shadcn
  // dan hanya berisi folder yang nyata ada di aplikasi (tidak mengada-ada)
  const navMainGroups = [
    {
      title: "Konten Website",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Warta & Publikasi",
          url: "/admin/news",
        },
        {
          title: "Kategori Berita",
          url: "/admin/categories",
        },
        {
          title: "Arsip Pergerakan",
          url: "/admin/gallery",
        },
        {
          title: "Repositori Dokumen",
          url: "/admin/documents",
        },
      ],
    },
    {
      title: "Sistem & Konfigurasi",
      url: "#",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "Pesan Masuk",
          url: "/admin/messages",
          badge: unreadCount,
        },
        {
          title: "Kategori Pesan",
          url: "/admin/message-categories",
        },
        {
          title: "Profil Organisasi",
          url: "/admin/organization",
        },
        {
          title: "Pengaturan",
          url: "/admin/settings",
        },
      ],
    },
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold font-serif text-lg">
                  F
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold font-serif">Admin BEM Pesantren Indonesia</span>
                  <span className="truncate text-xs opacity-80">Sistem Manajemen</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainGroups} label="Navigasi Utama" />
      </SidebarContent>
    </Sidebar>
  )
}

