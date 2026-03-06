'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const profileSchema = z.object({
    name: z.string().optional(),
    tagline: z.string().optional(),
    logoUrl: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    emailSecondary: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    phoneSecondary: z.string().optional(),
    whatsapp: z.string().optional(),
    whatsappSecondary: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    vision: z.string().optional(),
    mission: z.string().optional(),
    history: z.string().optional(),
})

export async function updateOrganizationProfile(prevState: unknown, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())

    const validated = profileSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.organizationProfile.upsert({
            where: { id: "default" },
            update: validated.data,
            create: { id: "default", ...validated.data }
        })

        revalidatePath('/contact')
        revalidatePath('/about')
        revalidatePath('/admin/organization')

        return { success: true, message: "Profil organisasi berhasil diperbarui" }
    } catch (error) {
        console.error('Update organization profile error:', error)
        return { error: 'Gagal memperbarui profil. Silakan coba lagi.' }
    }
}

