'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const bulkDeleteSchema = z.object({
    ids: z.array(z.string().cuid()).min(1, "Minimal 1 item harus dipilih")
})

export async function deleteNewsBulk(ids: string[]) {
    try {
        const validated = bulkDeleteSchema.parse({ ids })
        await prisma.news.deleteMany({ where: { id: { in: validated.ids } } })
        revalidatePath('/admin/news')
        revalidatePath('/news')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal menghapus berita' }
    }
}

export async function deleteGalleryBulk(ids: string[]) {
    try {
        const validated = bulkDeleteSchema.parse({ ids })
        await prisma.galleryAlbum.deleteMany({ where: { id: { in: validated.ids } } })
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal menghapus galeri' }
    }
}

export async function toggleFeatured(id: string, currentFeatured: boolean) {
    try {
        if (!currentFeatured) {
            // Unset semua dulu — hanya boleh 1 featured
            await prisma.news.updateMany({ where: { featured: true }, data: { featured: false } })
        }
        await prisma.news.update({ where: { id }, data: { featured: !currentFeatured } })
        revalidatePath('/admin/news')
        revalidatePath('/news')
        revalidatePath('/')
        return { success: true }
    } catch {
        return { success: false, error: 'Gagal mengubah status unggulan' }
    }
}
