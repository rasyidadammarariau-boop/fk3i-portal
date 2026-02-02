'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateMessageStatus(messageId: string, status: string) {
    try {
        await prisma.contactMessage.update({
            where: { id: messageId },
            data: { status }
        })

        revalidatePath('/admin/messages')
        return { success: true }
    } catch (error) {
        console.error('Update message status error:', error)
        return { error: 'Gagal mengupdate status pesan' }
    }
}

export async function updateAdminNotes(messageId: string, adminNotes: string) {
    try {
        await prisma.contactMessage.update({
            where: { id: messageId },
            data: { adminNotes }
        })

        revalidatePath('/admin/messages')
        return { success: true }
    } catch (error) {
        console.error('Update admin notes error:', error)
        return { error: 'Gagal mengupdate catatan admin' }
    }
}

export async function deleteMessage(messageId: string) {
    try {
        await prisma.contactMessage.delete({
            where: { id: messageId }
        })

        revalidatePath('/admin/messages')
        return { success: true }
    } catch (error) {
        console.error('Delete message error:', error)
        return { error: 'Gagal menghapus pesan' }
    }
}
