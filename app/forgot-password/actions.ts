'use server'

import prisma from "@/lib/prisma"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function requestPasswordReset(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        })

        // Selalu success agar tidak mengekspos apakah email terdaftar
        if (!user) {
            return { success: true }
        }

        // Generate token reset
        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 jam

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry }
        })

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
        const resetLink = `${baseUrl}/reset-password/${resetToken}`

        // Kirim email — jika SMTP belum dikonfigurasi, log ke console sebagai fallback
        try {
            await sendPasswordResetEmail(email, resetLink)
        } catch (emailError) {
            console.warn("[Email] SMTP mungkin belum dikonfigurasi. Link reset (development):", resetLink)
            console.error("[Email] Error detail:", emailError)
        }

        return { success: true }
    } catch (error) {
        console.error("Password reset error:", error)
        return { error: "Gagal memproses permintaan. Silakan coba lagi." }
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        })

        if (!user) {
            return { error: "Link reset tidak valid atau sudah kadaluarsa. Silakan minta link baru." }
        }

        const bcrypt = await import("bcryptjs")
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Reset password error:", error)
        return { error: "Gagal mereset password. Silakan coba lagi." }
    }
}
