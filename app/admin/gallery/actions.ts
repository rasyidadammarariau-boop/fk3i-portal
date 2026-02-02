'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteGalleryAlbum(id: string) {
    try {
        await prisma.galleryAlbum.delete({
            where: { id }
        })
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        return { error: 'Gagal menghapus album' }
    }
}

export async function deleteGalleryImage(id: string) {
    try {
        await prisma.galleryImage.delete({
            where: { id }
        })
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        return { error: 'Gagal menghapus foto' }
    }
}

export async function deleteGalleryImages(ids: string[]) {
    try {
        await prisma.galleryImage.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        return { error: 'Gagal menghapus foto yang dipilih' }
    }
}

export async function deleteGalleryAlbums(ids: string[]) {
    try {
        await prisma.galleryAlbum.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        return { error: 'Gagal menghapus album yang dipilih' }
    }
}

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

async function uploadFile(file: File): Promise<string | null> {
    if (!file || file.size === 0 || file.name === 'undefined') return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", "uploads", "gallery")
    await mkdir(uploadDir, { recursive: true })

    const sanitizedFilename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
    const filename = `${Date.now()}-${sanitizedFilename}`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)
    return `/uploads/gallery/${filename}`
}

export async function createAlbum(prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        eventDate: formData.get('eventDate') as string,
        published: formData.get('status') === 'published',
    }

    const coverFile = formData.get('cover') as File
    let coverPath = null

    if (coverFile && coverFile.size > 0) {
        coverPath = await uploadFile(coverFile)
    }

    // Generate slug
    const slug = rawData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    try {
        const newAlbum = await prisma.galleryAlbum.create({
            data: {
                title: rawData.title,
                description: rawData.description,
                eventDate: new Date(rawData.eventDate),
                slug,
                cover: coverPath,
                published: rawData.published
            }
        })
        revalidatePath('/admin/gallery')
        redirect(`/admin/gallery/${newAlbum.id}/edit`)
    } catch (error) {
        // NextJS redirect throws an error, so we need to rethrow it if it's a redirect
        if ((error as any).message === 'NEXT_REDIRECT') throw error
        console.error(error)
        return { error: 'Gagal membuat album' }
    }
}


export async function uploadGalleryImage(prevState: any, formData: FormData) {
    const imageFile = formData.get('image') as File
    const title = formData.get('title') as string
    const published = formData.get('status') === 'published'

    if (!imageFile || imageFile.size === 0) {
        return { error: 'File gambar wajib diisi' }
    }

    const imagePath = await uploadFile(imageFile)

    if (!imagePath) {
        return { error: 'Gagal mengupload file' }
    }

    try {
        await prisma.galleryImage.create({
            data: {
                url: imagePath,
                title: title || imageFile.name,
                albumId: null, // Standalone
                published: published
            }
        })
        revalidatePath('/admin/gallery')
    } catch (error) {
        return { error: 'Gagal menyimpan data foto' }
    }

    redirect('/admin/gallery')
}

export async function uploadAlbumPhotos(albumId: string, formData: FormData) {
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
        return { error: 'Tidak ada foto yang dipilih' }
    }

    let successCount = 0
    let failCount = 0

    for (const file of files) {
        if (file.size === 0) continue

        const imagePath = await uploadFile(file)
        if (!imagePath) {
            failCount++
            continue
        }

        try {
            await prisma.galleryImage.create({
                data: {
                    url: imagePath,
                    title: file.name,
                    albumId: albumId
                }
            })
            successCount++
        } catch (error) {
            failCount++
        }
    }

    revalidatePath(`/admin/gallery/${albumId}`)
    revalidatePath('/admin/gallery')

    return {
        success: true,
        message: `Berhasil upload ${successCount} foto.${failCount > 0 ? ` Gagal: ${failCount}` : ''}`
    }
}


export async function updateGalleryAlbum(id: string, prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        eventDate: formData.get('eventDate') as string,
        published: formData.get('status') === 'published',
    }

    const coverFile = formData.get('cover') as File
    let coverPath = undefined

    if (coverFile && coverFile.size > 0) {
        const uploadedPath = await uploadFile(coverFile)
        if (uploadedPath) {
            coverPath = uploadedPath
        }
    }

    try {
        await prisma.galleryAlbum.update({
            where: { id },
            data: {
                title: rawData.title,
                description: rawData.description,
                eventDate: new Date(rawData.eventDate),
                published: rawData.published,
                ...(coverPath && { cover: coverPath })
            }
        })
    } catch (error) {
        return { error: 'Gagal mengupdate album' }
    }

    revalidatePath('/admin/gallery')
    revalidatePath(`/admin/gallery/${id}`)
    redirect('/admin/gallery')
}

export async function updateGalleryImage(id: string, prevState: any, formData: FormData) {
    const title = formData.get('title') as string
    const published = formData.get('status') === 'published'

    const imageFile = formData.get('image') as File
    let imagePath = undefined

    if (imageFile && imageFile.size > 0) {
        const uploadedPath = await uploadFile(imageFile)
        if (uploadedPath) {
            imagePath = uploadedPath
        }
    }

    try {
        await prisma.galleryImage.update({
            where: { id },
            data: {
                title,
                published,
                ...(imagePath && { url: imagePath })
            }
        })
    } catch (error) {
        return { error: 'Gagal mengupdate foto: ' + (error as Error).message }
    }

    revalidatePath('/admin/gallery')
    redirect('/admin/gallery')
}
