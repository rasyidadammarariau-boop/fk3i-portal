'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const categorySchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    slug: z.string().min(3, "Slug minimal 3 karakter"),
    description: z.string().optional(),
    icon: z.string().optional(),
    published: z.boolean().default(true),
    order: z.number().int().default(0),
})

export async function createCategory(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description') || undefined,
        icon: formData.get('icon') || undefined,
        published: formData.get('published') === 'on',
        order: parseInt(formData.get('order') as string) || 0,
    }

    const validated = categorySchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.messageCategory.create({
            data: validated.data
        })

        revalidatePath('/admin/message-categories')
        return { success: true, message: "Kategori berhasil ditambahkan" }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: 'Slug sudah digunakan' }
        }
        console.error('Create category error:', error)
        return { error: 'Gagal menambahkan kategori' }
    }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description') || undefined,
        icon: formData.get('icon') || undefined,
        published: formData.get('published') === 'on',
        order: parseInt(formData.get('order') as string) || 0,
    }

    const validated = categorySchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.messageCategory.update({
            where: { id },
            data: validated.data
        })

        revalidatePath('/admin/message-categories')
        return { success: true, message: "Kategori berhasil diperbarui" }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: 'Slug sudah digunakan' }
        }
        console.error('Update category error:', error)
        return { error: 'Gagal memperbarui kategori' }
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.messageCategory.delete({
            where: { id }
        })

        revalidatePath('/admin/message-categories')
        return { success: true }
    } catch (error) {
        console.error('Delete category error:', error)
        return { error: 'Gagal menghapus kategori' }
    }
}

export async function toggleCategoryPublished(id: string, published: boolean) {
    try {
        await prisma.messageCategory.update({
            where: { id },
            data: { published }
        })

        revalidatePath('/admin/message-categories')
        return { success: true }
    } catch (error) {
        console.error('Toggle category error:', error)
        return { error: 'Gagal mengupdate status kategori' }
    }
}
