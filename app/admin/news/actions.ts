'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import sharp from "sharp"
import { auth } from "@/lib/auth"

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function uploadFile(file: File, type: 'image' | 'document'): Promise<string | null> {
    if (!file || file.size === 0 || file.name === 'undefined') return null
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const subDir = type === 'image' ? 'uploads' : 'documents'
    const uploadDir = join(process.cwd(), "public", subDir)

    await mkdir(uploadDir, { recursive: true })
    const sanitizedFilename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()

    let filename = `${Date.now()}-${sanitizedFilename}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let finalBuffer: Buffer<ArrayBufferLike> = buffer as Buffer<ArrayBufferLike>

    if (type === 'image') {
        try {
            const nameWithoutExt = sanitizedFilename.includes('.') ? sanitizedFilename.substring(0, sanitizedFilename.lastIndexOf('.')) : sanitizedFilename
            filename = `${Date.now()}-${nameWithoutExt}.webp`
            finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()
        } catch {
            // fallback
            filename = `${Date.now()}-${sanitizedFilename}`
        }
    }

    await writeFile(join(uploadDir, filename), finalBuffer)
    return `/${subDir}/${filename}`
}

/** Hitung estimasi waktu baca dari konten HTML (strip tag, hitung kata) */
function calculateReadTime(content: string): number {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = plainText.split(' ').filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / 200)) // 200 kata/menit
}

/** Generate atau find tag, return IDs */
async function upsertTags(tagNames: string[]): Promise<string[]> {
    const ids: string[] = []
    for (const name of tagNames) {
        if (!name.trim()) continue
        const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const tag = await prisma.tag.upsert({
            where: { slug },
            update: {},
            create: { name: name.trim(), slug },
        })
        ids.push(tag.id)
    }
    return ids
}

// ─── ACTIONS ──────────────────────────────────────────────────────────────────

export async function createNews(prevState: unknown, formData: FormData) {
    const session = await auth()
    const sessionUserName = session?.user?.name || ''

    const imageMode = formData.get('imageMode') as string
    let finalImagePath = ''
    if (imageMode === 'url' || imageMode === 'gallery') {
        finalImagePath = formData.get('imageUrl') as string || ''
    } else {
        finalImagePath = formData.get('image') as string || ''
    }

    const attachmentFile = formData.get('attachment') as File
    const uploadedAttachmentPath = await uploadFile(attachmentFile, 'document')
    const attachmentName = formData.get('attachmentName') as string || (attachmentFile?.name !== 'undefined' ? attachmentFile?.name : null)

    const content = formData.get('content') as string
    const tagsRaw = formData.get('tags') as string || ''
    const tagNames = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    const readTime = calculateReadTime(content)

    const publishedAtRaw = formData.get('publishedAt') as string
    const featured = formData.get('featured') === 'on'
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string

    const title = formData.get('title') as string
    const slugBase = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'untitled'
    const slug = `${slugBase}-${Date.now().toString().slice(-6)}`

    try {
        const tagIds = await upsertTags(tagNames)

        await prisma.news.create({
            data: {
                title,
                content,
                image: finalImagePath,
                categoryId: formData.get('categoryId') as string || null,
                excerpt: formData.get('excerpt') as string || null,
                author: (formData.get('author') as string) || sessionUserName || null,
                tags: tagsRaw || null,
                readTime,
                published: formData.get('status') === 'published',
                featured,
                attachmentUrl: uploadedAttachmentPath || null,
                attachmentName: uploadedAttachmentPath ? attachmentName : null,
                publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                slug,
                tagRelations: tagIds.length > 0 ? {
                    create: tagIds.map(tagId => ({ tagId }))
                } : undefined,
            }
        })
    } catch (error) {
        console.error("Create news error:", error)
        return { error: 'Gagal membuat berita. ' + (error as Error).message }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    revalidatePath('/')
    redirect('/admin/news')
}

export async function updateNews(id: string, prevState: unknown, formData: FormData) {
    const session = await auth()
    const sessionUserName = session?.user?.name || ''

    const imageMode = formData.get('imageMode') as string
    const existingImage = formData.get('existingImage') as string
    let finalImage = existingImage

    if (imageMode === 'url' || imageMode === 'gallery') {
        const inputUrl = formData.get('imageUrl') as string
        if (inputUrl) finalImage = inputUrl
    } else {
        const uploadUrl = formData.get('image') as string
        if (uploadUrl) finalImage = uploadUrl
    }

    const attachmentFile = formData.get('attachment') as File
    const existingAttachment = formData.get('existingAttachmentUrl') as string
    let finalAttachmentUrl = existingAttachment || null
    let finalAttachmentName = formData.get('attachmentName') as string || formData.get('existingAttachmentName') as string || null

    const uploadedAttachmentPath = await uploadFile(attachmentFile, 'document')
    if (uploadedAttachmentPath) {
        finalAttachmentUrl = uploadedAttachmentPath
        if (!formData.get('attachmentName')) {
            finalAttachmentName = attachmentFile.name
        }
    }

    // fitur hapus lampiran (kalau user kosongkan field tapi ga upload)
    if (formData.get('removeAttachment') === 'true') {
        finalAttachmentUrl = null
        finalAttachmentName = null
    }

    const content = formData.get('content') as string
    const tagsRaw = formData.get('tags') as string || ''
    const tagNames = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    const readTime = calculateReadTime(content)

    const publishedAtRaw = formData.get('publishedAt') as string
    const featured = formData.get('featured') === 'on'
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string

    try {
        const tagIds = await upsertTags(tagNames)

        // Hapus tag lama, buat yang baru
        await prisma.newsTag.deleteMany({ where: { newsId: id } })

        await prisma.news.update({
            where: { id },
            data: {
                title: formData.get('title') as string,
                content,
                image: finalImage,
                categoryId: formData.get('categoryId') as string || null,
                excerpt: formData.get('excerpt') as string || null,
                author: (formData.get('author') as string) || sessionUserName || null,
                tags: tagsRaw || null,
                readTime,
                published: formData.get('status') === 'published',
                featured,
                attachmentUrl: finalAttachmentUrl,
                attachmentName: finalAttachmentName,
                publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                tagRelations: tagIds.length > 0 ? {
                    create: tagIds.map(tagId => ({ tagId }))
                } : undefined,
            }
        })
    } catch (error) {
        console.error("Update news error:", error)
        return { error: 'Gagal memperbarui berita.' }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    revalidatePath('/')
    redirect('/admin/news')
}

export async function toggleFeatured(id: string, currentFeatured: boolean) {
    try {
        // Jika set featured, unset yang lain dulu
        if (!currentFeatured) {
            await prisma.news.updateMany({
                where: { featured: true },
                data: { featured: false }
            })
        }
        await prisma.news.update({
            where: { id },
            data: { featured: !currentFeatured }
        })
        revalidatePath('/admin/news')
        revalidatePath('/news')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}

export async function incrementViews(id: string) {
    try {
        await prisma.news.update({
            where: { id },
            data: { views: { increment: 1 } }
        })
    } catch {
        // Silent fail — tidak kritis
    }
}

export async function deleteNewsBulk(ids: string[]) {
    try {
        await prisma.news.deleteMany({ where: { id: { in: ids } } })
        revalidatePath('/admin/news')
        revalidatePath('/news')
        return { success: true }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}
