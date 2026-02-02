'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { hash, compare } from "bcryptjs"
import { auth } from "@/lib/auth"

// Validation schemas
const updateProfileSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100),
    email: z.string().email("Email tidak valid"),
    phone: z.string().optional(),
    bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
})

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini harus diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi tidak cocok",
    path: ["confirmPassword"],
})

export async function updateProfile(formData: FormData) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: (formData.get('phone') as string) || null,
            bio: (formData.get('bio') as string) || null,
        }

        const validated = updateProfileSchema.parse(data)

        // Check if email is already taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email }
        })

        if (existingUser && existingUser.id !== session.user.id) {
            return { success: false, error: 'Email sudah digunakan oleh user lain' }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validated.name,
                email: validated.email,
                phone: validated.phone,
                bio: validated.bio,
            }
        })

        revalidatePath('/admin/settings')
        return { success: true, message: 'Profil berhasil diperbarui' }
    } catch (error) {
        console.error("Update profile error:", error)
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal memperbarui profil' }
    }
}

export async function changePassword(formData: FormData) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const data = {
            currentPassword: formData.get('currentPassword') as string,
            newPassword: formData.get('newPassword') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        const validated = changePasswordSchema.parse(data)

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) {
            return { success: false, error: 'User tidak ditemukan' }
        }

        // Verify current password
        const isPasswordValid = await compare(validated.currentPassword, user.password)
        if (!isPasswordValid) {
            return { success: false, error: 'Password saat ini salah' }
        }

        // Hash new password
        const hashedPassword = await hash(validated.newPassword, 10)

        // Update password
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        })

        revalidatePath('/admin/settings')
        return { success: true, message: 'Password berhasil diubah' }
    } catch (error) {
        console.error("Change password error:", error)
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal mengubah password' }
    }
}

export async function updateNotificationSettings(settings: {
    emailNotifications: boolean
    newsNotifications: boolean
    agendaNotifications: boolean
    commentNotifications: boolean
    weeklyNewsletter: boolean
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Upsert user settings
        await prisma.userSettings.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                ...settings
            },
            update: settings
        })

        revalidatePath('/admin/settings')
        return { success: true, message: 'Pengaturan notifikasi berhasil disimpan' }
    } catch (error) {
        console.error("Update notification settings error:", error)
        return { success: false, error: 'Gagal menyimpan pengaturan notifikasi' }
    }
}

export async function updatePreferences(preferences: {
    darkMode: boolean
    compactMode: boolean
    animations: boolean
    language: string
    itemsPerPage: number
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Upsert user settings
        await prisma.userSettings.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                ...preferences
            },
            update: preferences
        })

        revalidatePath('/admin/settings')
        return { success: true, message: 'Preferensi berhasil disimpan' }
    } catch (error) {
        return { success: false, error: 'Gagal menyimpan preferensi' }
    }
}

export async function getUserSettings(userId: string) {
    try {
        const settings = await prisma.userSettings.findUnique({
            where: { userId }
        })

        return settings
    } catch (error) {
        console.error("Get user settings error:", error)
        return null
    }
}

export async function deleteAccount() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Delete user settings first (if exists)
        await prisma.userSettings.deleteMany({
            where: { userId: session.user.id }
        })

        // Delete user account
        await prisma.user.delete({
            where: { id: session.user.id }
        })

        return { success: true, message: 'Akun berhasil dihapus' }
    } catch (error) {
        console.error("Delete account error:", error)
        return { success: false, error: 'Gagal menghapus akun' }
    }
}
