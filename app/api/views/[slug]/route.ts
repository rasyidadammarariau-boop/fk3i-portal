import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    try {
        await prisma.news.update({
            where: { slug },
            data: { views: { increment: 1 } }
        })
        return NextResponse.json({ success: true })
    } catch {
        // Jika gagal (misal berita tidak ditemukan), tidak perlu error fatal
        return NextResponse.json({ success: false }, { status: 200 })
    }
}
