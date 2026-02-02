'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
    name: z.string().min(2, "Nama kategori minimal 2 karakter"),
})

export async function createCategory(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
    }

    // Generate slug
    const slug = rawData.name?.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'untitled';

    try {
        const validated = categorySchema.parse(rawData)

        // Check duplicate
        const existing = await prisma.category.findUnique({
            where: { slug }
        })

        if (existing) {
            return { error: 'Kategori dengan nama ini sudah ada' }
        }

        await prisma.category.create({
            data: {
                name: validated.name,
                slug,
            }
        })

        revalidatePath('/admin/categories')
        return { success: true, message: 'Kategori berhasil dibuat' }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message }
        }
        return { error: 'Gagal membuat kategori' }
    }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
    }

    const slug = rawData.name?.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'untitled';

    try {
        const validated = categorySchema.parse(rawData)

        // Check duplicate excluding self
        const existing = await prisma.category.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        })

        if (existing) {
            return { error: 'Kategori dengan nama ini sudah ada' }
        }

        await prisma.category.update({
            where: { id },
            data: {
                name: validated.name,
                slug
            }
        })

        revalidatePath('/admin/categories')
        return { success: true, message: 'Kategori berhasil diperbarui' }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message }
        }
        return { error: 'Gagal memperbarui kategori' }
    }
}

export async function deleteCategory(id: string) {
    try {
        // Check usage in News
        const usedCount = await prisma.news.count({
            where: { categoryId: id }
        })

        if (usedCount > 0) {
            return { success: false, error: `Gagal: Kategori ini digunakan oleh ${usedCount} berita.` }
        }

        await prisma.category.delete({
            where: { id }
        })

        revalidatePath('/admin/categories')
        return { success: true, message: 'Kategori berhasil dihapus' }
    } catch (error) {
        console.error('Delete category error:', error)
        return { success: false, error: 'Gagal menghapus kategori' }
    }
}
