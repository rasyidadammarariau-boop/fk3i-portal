'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const agendaSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    location: z.string().min(1, "Lokasi wajib diisi"),
    image: z.string().optional().or(z.literal('')),
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

export async function createAgenda(prevState: any, formData: FormData) {
    const imageFile = formData.get('image') as File
    const uploadedImagePath = await uploadImage(imageFile)

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        location: formData.get('location'),
        image: uploadedImagePath || '',
        published: formData.get('status') === 'published',
    }

    const validated = agendaSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { title, description, date, location, image, published } = validated.data

    // Generate slug
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    try {
        await prisma.agenda.create({
            data: {
                title,
                slug,
                description,
                date: new Date(date),
                location,
                image,
                published,
            }
        })
    } catch (error) {
        console.error('Create agenda error:', error)
        return { error: 'Gagal membuat agenda' }
    }

    revalidatePath('/admin/agenda')
    redirect('/admin/agenda')
}

export async function updateAgenda(id: string, prevState: any, formData: FormData) {
    const imageFile = formData.get('image') as File
    const existingImage = formData.get('existingImage') as string

    let finalImage = existingImage
    const uploadedImagePath = await uploadImage(imageFile)
    if (uploadedImagePath) {
        finalImage = uploadedImagePath
    }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        location: formData.get('location'),
        image: finalImage,
        published: formData.get('status') === 'published',
    }

    const validated = agendaSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { title, description, date, location, image, published } = validated.data

    try {
        await prisma.agenda.update({
            where: { id },
            data: {
                title,
                description,
                date: new Date(date),
                location,
                image,
                published,
            }
        })
    } catch (error) {
        console.error('Update agenda error:', error)
        return { error: 'Gagal mengupdate agenda' }
    }

    revalidatePath('/admin/agenda')
    redirect('/admin/agenda')
}
