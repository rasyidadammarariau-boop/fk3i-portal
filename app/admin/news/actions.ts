'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const newsSchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    content: z.string().min(10, "Konten minimal 10 karakter"),
    image: z.string().optional().or(z.literal('')),
    categoryId: z.string().min(1, "Kategori wajib diisi"),
    excerpt: z.string().optional(),
    tags: z.string().optional(),
    author: z.string().optional(),
    published: z.coerce.boolean().default(true)
})

async function uploadImage(file: File): Promise<string | null> {
    if (!file || file.size === 0 || file.name === 'undefined') return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if not exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    // Sanitize filename
    const sanitizedFilename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
    const filename = `${Date.now()}-${sanitizedFilename}`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)
    return `/uploads/${filename}`
}

export async function createNews(prevState: any, formData: FormData) {
    const imageFile = formData.get('image') as File
    const uploadedImagePath = await uploadImage(imageFile)

    const rawData = {
        title: formData.get('title'),
        content: formData.get('content'),
        image: uploadedImagePath || '',
        categoryId: formData.get('categoryId'),
        excerpt: formData.get('excerpt'),
        tags: formData.get('tags'),
        author: formData.get('author'),
        published: formData.get('status') === 'published',
    }

    // Generate slug from title
    const slugBase = rawData.title?.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'untitled';

    // Add random string to ensure uniqueness
    const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

    try {
        await prisma.news.create({
            data: {
                title: rawData.title as string,
                content: rawData.content as string,
                image: rawData.image as string,
                categoryId: rawData.categoryId as string,
                excerpt: rawData.excerpt as string,
                tags: rawData.tags as string,
                author: rawData.author as string,
                published: rawData.published,
                slug,
            }
        })
    } catch (error) {
        console.error("Create news error:", error)
        return { error: 'Gagal membuat berita. ' + (error as Error).message }
    }

    revalidatePath('/admin/news')
    redirect('/admin/news')
}

export async function updateNews(id: string, prevState: any, formData: FormData) {
    const imageFile = formData.get('image') as File
    const existingImage = formData.get('existingImage') as string

    let finalImage = existingImage

    // Upload new image if exists
    const uploadedImagePath = await uploadImage(imageFile)
    if (uploadedImagePath) {
        finalImage = uploadedImagePath
    }

    const rawData = {
        title: formData.get('title'),
        content: formData.get('content'),
        image: finalImage,
        categoryId: formData.get('categoryId'),
        excerpt: formData.get('excerpt'),
        tags: formData.get('tags'),
        author: formData.get('author'),
        published: formData.get('status') === 'published',
    }

    try {
        await prisma.news.update({
            where: { id },
            data: {
                title: rawData.title as string,
                content: rawData.content as string,
                image: rawData.image as string, // Safe URL string
                categoryId: rawData.categoryId as string,
                excerpt: rawData.excerpt as string,
                tags: rawData.tags as string,
                author: rawData.author as string,
                published: rawData.published,
            }
        })
    } catch (error) {
        console.error("Update news error:", error)
        return { error: 'Gagal memperbarui berita.' }
    }

    revalidatePath('/admin/news')
    redirect('/admin/news')
}
