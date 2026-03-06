"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Mail, Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import Link from "next/link"

import { getRecentNotifications, NotificationItem } from "@/app/admin/notifications-action"

export function NotificationMenu() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Mengambil data notifikasi riil dari Prisma DB
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getRecentNotifications()
                setNotifications(data)
            } catch (error) {
                console.error("Gagal mengambil notifikasi", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotifications()
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        toast.success("Semua notifikasi ditandai dibaca")
    }

    const unreadNotifications = notifications.filter(n => !n.read)
    const readNotifications = notifications.filter(n => n.read)

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'message': return <Mail className="w-4 h-4 " />
            case 'agenda': return <Calendar className="w-4 h-4 " />
            case 'system': return <Info className="w-4 h-4 " />
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive text-[8px] font-bold text-destructive-foreground items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[340px]">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">Notifikasi</p>
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {unreadCount} Baru
                                </Badge>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm ">Memuat notifikasi...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm ">Belum ada notifikasi.</div>
                    ) : (
                        <div className="flex flex-col gap-1 p-1">
                            {/* Unread Section */}
                            {unreadNotifications.map(notification => (
                                <DropdownMenuItem key={notification.id} className="cursor-pointer items-start p-3 bg-muted/50 focus:bg-muted" asChild>
                                    <ConditionalLink href={notification.link}>
                                        <div className="flex gap-3 w-full">
                                            <div className="mt-0.5 bg-background p-1.5 rounded-full shadow-sm border">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="flex items-start justify-between">
                                                    <span className="text-sm font-semibold">{notification.title}</span>
                                                    <span className="text-[10px]  whitespace-nowrap ml-2">
                                                        {new Date(notification.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className="text-xs  line-clamp-2 leading-snug">
                                                    {notification.message}
                                                </span>
                                            </div>
                                        </div>
                                    </ConditionalLink>
                                </DropdownMenuItem>
                            ))}

                            {/* Read Section */}
                            {readNotifications.map(notification => (
                                <DropdownMenuItem key={notification.id} className="cursor-pointer items-start p-3 " asChild>
                                    <ConditionalLink href={notification.link}>
                                        <div className="flex gap-3 w-full opacity-70">
                                            <div className="mt-0.5">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="flex items-start justify-between">
                                                    <span className="text-sm font-medium">{notification.title}</span>
                                                    <span className="text-[10px] whitespace-nowrap ml-2">
                                                        {new Date(notification.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className="text-xs line-clamp-2 leading-snug">
                                                    {notification.message}
                                                </span>
                                            </div>
                                        </div>
                                    </ConditionalLink>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {unreadCount > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <Button
                                variant="outline"
                                className="w-full text-xs h-8"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleMarkAllAsRead()
                                }}
                            >
                                <Check className="w-3 h-3 mr-2" />
                                Tandai Semua Dibaca
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Komponen helper pembantu 
const ConditionalLink = ({ href, children, ...props }: { href?: string, children: React.ReactNode, [key: string]: unknown }) => {
    if (href) {
        return <Link href={href} {...props}>{children}</Link>
    }
    return <div {...props}>{children}</div>
}

