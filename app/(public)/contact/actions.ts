'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"

const contactSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().optional(),
    categoryId: z.string().optional(),
    subject: z.string().min(5, "Perihal minimal 5 karakter"),
    message: z.string().min(10, "Pesan minimal 10 karakter"),
})

export async function submitContactMessage(prevState: unknown, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
        categoryId: formData.get('categoryId') || undefined,
        subject: formData.get('subject'),
        message: formData.get('message'),
    }

    const validated = contactSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.contactMessage.create({
            data: validated.data
        })

        return { success: true, message: "Pesan Anda berhasil dikirim. Kami akan segera menghubungi Anda." }
    } catch (error) {
        console.error('Submit contact message error:', error)
        return { error: 'Gagal mengirim pesan. Silakan coba lagi.' }
    }
}

