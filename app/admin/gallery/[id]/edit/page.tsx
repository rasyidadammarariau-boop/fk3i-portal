import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditAlbumForm from "@/components/admin/edit-album-form"

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
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

    return <EditAlbumForm album={album} />
}
