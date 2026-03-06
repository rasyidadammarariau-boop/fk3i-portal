'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"

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

export async function replyToMessage(messageId: string, replyText: string) {
    try {
        const message = await prisma.contactMessage.findUnique({
            where: { id: messageId }
        })

        if (!message) {
            return { error: 'Pesan tidak ditemukan' }
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'BEM Pesantren Indonesia Portal <noreply@bem-pesantren.or.id>',
            to: message.email,
            replyTo: process.env.SMTP_USER,
            subject: `Re: ${message.subject}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1a5c3a; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Forum BEM Pesantren Indonesia</h2>
                    </div>
                    <div style="padding: 24px; border: 1px solid #e5e7eb;">
                        <p style="color: #374151;">Yth. <strong>${message.name}</strong>,</p>
                        <div style="background: #f9fafb; border-left: 4px solid #1a5c3a; padding: 16px; margin: 16px 0; white-space: pre-wrap; color: #374151;">
                            ${replyText.replace(/\n/g, '<br/>')}
                        </div>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                        <p style="color: #6b7280; font-size: 12px;">
                            Email ini adalah balasan dari pesan Anda kepada BEM Pesantren Indonesia. Pesan asli Anda:<br/>
                            <em style="color: #9ca3af;">"${message.message.substring(0, 200)}${message.message.length > 200 ? '...' : ''}"</em>
                        </p>
                    </div>
                    <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} Forum BEM Pesantren Indonesia. bem-pesantren.or.id
                    </div>
                </div>
            `,
        })

        // Update status to replied and save reply as admin notes
        await prisma.contactMessage.update({
            where: { id: messageId },
            data: {
                status: 'replied',
                adminNotes: `[Balasan terkirim ${new Date().toLocaleDateString('id-ID')}]: ${replyText}`,
            }
        })

        revalidatePath('/admin/messages')
        return { success: true, message: 'Balasan berhasil dikirim' }
    } catch (error: unknown) {
        console.error('Reply message error:', error)
        if (typeof error === 'object' && error !== null && 'code' in error && ((error as { code: string }).code === 'ECONNECTION' || (error as { code: string }).code === 'EAUTH')) {
            return { error: 'Gagal terhubung ke server email. Periksa konfigurasi SMTP di .env' }
        }
        return { error: 'Gagal mengirim balasan: ' + (error instanceof Error ? error.message : 'Error tidak diketahui') }
    }
}


