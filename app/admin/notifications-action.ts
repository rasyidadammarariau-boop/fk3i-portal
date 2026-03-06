"use server"

import prisma from "@/lib/prisma"

// We are going to fetch "new" ContactMessages as Message notifications,
// and maybe upcoming "Agenda" as Agenda notifications.
// Both formatted into a unified Notification structure.

export type NotificationType = 'message' | 'agenda' | 'system'

export interface NotificationItem {
    id: string
    title: string
    message: string
    type: NotificationType
    read: boolean
    createdAt: string
    link?: string
}

export async function getRecentNotifications(): Promise<NotificationItem[]> {
    try {
        const notifications: NotificationItem[] = []

        // 1. Ambil 5 Pesan Kontak terbaru dengan status 'new'
        const newMessages = await prisma.contactMessage.findMany({
            where: { status: 'new' },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        newMessages.forEach((msg: { id: string, name: string, subject: string, createdAt: Date }) => {
            notifications.push({
                id: `msg-${msg.id}`,
                title: `Pesan Baru dari ${msg.name}`,
                message: msg.subject,
                type: 'message',
                read: false,
                createdAt: msg.createdAt.toISOString(),
                link: '/admin/messages'
            })
        })



        // Sort by newest
        notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return notifications
    } catch (error) {
        console.error("Gagal mengambil notifikasi:", error)
        return []
    }
}

