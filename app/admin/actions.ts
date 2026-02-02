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
        // Validate input
        const validated = bulkDeleteSchema.parse({ ids })

        await prisma.news.deleteMany({
            where: {
                id: {
                    in: validated.ids
                }
            }
        })
        revalidatePath('/admin/news')
        return { success: true }
    } catch (error) {
        console.error("Delete news bulk error:", error)
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal menghapus berita' }
    }
}

export async function deleteGalleryBulk(ids: string[]) {
    try {
        const validated = bulkDeleteSchema.parse({ ids })

        await prisma.galleryAlbum.deleteMany({
            where: {
                id: {
                    in: validated.ids
                }
            }
        })
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        console.error("Delete gallery bulk error:", error)
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal menghapus galeri' }
    }
}

export async function deleteAgendaBulk(ids: string[]) {
    try {
        const validated = bulkDeleteSchema.parse({ ids })

        await prisma.agenda.deleteMany({
            where: {
                id: {
                    in: validated.ids
                }
            }
        })
        revalidatePath('/admin/agenda')
        return { success: true }
    } catch (error) {
        console.error("Delete agenda bulk error:", error)
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: 'Gagal menghapus agenda' }
    }
}
