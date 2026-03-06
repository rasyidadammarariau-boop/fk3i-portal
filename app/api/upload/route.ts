import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import sharp from 'sharp'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function POST(request: NextRequest) {
    try {
        // Check auth
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'Tidak ada file yang diupload' }, { status: 400 })
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF' }, { status: 400 })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Ukuran file maksimal 2MB' }, { status: 400 })
        }

        // Generate unique filename and force .webp extension
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
        const filePath = join(UPLOAD_DIR, uniqueName)

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true })

        // Convert and write file to disk
        const buffer = Buffer.from(await file.arrayBuffer())
        const optimizedBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer()

        await writeFile(filePath, optimizedBuffer)

        const url = `/uploads/${uniqueName}`
        return NextResponse.json({ url, success: true })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 })
    }
}

