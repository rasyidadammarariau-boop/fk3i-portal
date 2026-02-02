
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditImageForm from "@/components/admin/edit-image-form"

export default async function EditImagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const image = await prisma.galleryImage.findUnique({
        where: { id }
    })

    if (!image) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Edit Foto Lepas</h1>
            <EditImageForm image={image} />
        </div>
    )
}
