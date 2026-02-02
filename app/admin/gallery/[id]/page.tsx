import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AlbumDetailView } from "@/components/admin/album-detail-view"

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const album = await prisma.galleryAlbum.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!album) {
        notFound()
    }

    return <AlbumDetailView album={album} />
}
