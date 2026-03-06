'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join, extname } from "path"



async function uploadDocFile(file: File): Promise<{ url: string; name: string } | null> {
    if (!file || file.size === 0 || file.name === 'undefined') return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", "documents", "org")
    await mkdir(uploadDir, { recursive: true })

    const ext = extname(file.name)
    const sanitized = file.name.replace(/[^a-z0-9.\-_]/gi, '_').toLowerCase()
    const filename = `${Date.now()}-${sanitized}`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)
    return { url: `/documents/org/${filename}`, name: file.name }
}

export async function createDocument(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string || 'umum'
    const published = formData.get('status') === 'published'
    const file = formData.get('file') as File

    if (!title?.trim()) return { error: 'Judul dokumen wajib diisi' }
    if (!file || file.size === 0) return { error: 'File dokumen wajib diunggah' }

    const uploaded = await uploadDocFile(file)
    if (!uploaded) return { error: 'Gagal mengunggah file' }

    try {
        await prisma.orgDocument.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                fileUrl: uploaded.url,
                fileName: uploaded.name,
                category,
                published,
                uploadedBy: session.user.name || session.user.email || 'Admin',
            }
        })
    } catch {
        return { error: 'Gagal menyimpan dokumen' }
    }

    revalidatePath('/admin/documents')
    revalidatePath('/documents')
    redirect('/admin/documents')
}

export async function updateDocument(id: string, prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string || 'umum'
    const published = formData.get('status') === 'published'
    const file = formData.get('file') as File

    let fileData: { fileUrl?: string; fileName?: string } = {}
    if (file && file.size > 0) {
        const uploaded = await uploadDocFile(file)
        if (uploaded) {
            fileData = { fileUrl: uploaded.url, fileName: uploaded.name }
        }
    }

    try {
        await prisma.orgDocument.update({
            where: { id },
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                category,
                published,
                ...fileData,
            }
        })
    } catch {
        return { error: 'Gagal memperbarui dokumen' }
    }

    revalidatePath('/admin/documents')
    revalidatePath('/documents')
    redirect('/admin/documents')
}

export async function deleteDocument(id: string) {
    try {
        await prisma.orgDocument.delete({ where: { id } })
        revalidatePath('/admin/documents')
        revalidatePath('/documents')
        return { success: true }
    } catch {
        return { error: 'Gagal menghapus dokumen' }
    }
}

export async function toggleDocumentPublish(id: string, published: boolean) {
    try {
        await prisma.orgDocument.update({ where: { id }, data: { published } })
        revalidatePath('/admin/documents')
        revalidatePath('/documents')
        return { success: true }
    } catch {
        return { error: 'Gagal memperbarui status' }
    }
}

export async function incrementDownloadCount(id: string) {
    try {
        await prisma.orgDocument.update({
            where: { id },
            data: { downloadCount: { increment: 1 } }
        })
    } catch { /* silent */ }
}

