import prisma from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb-custom"
import { Button } from "@/components/ui/button"

async function getPhoto(id: string) {
    try {
        return await prisma.galleryImage.findUnique({
            where: { id },
            include: { album: true }
        })
    } catch (e) {
        return null
    }
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const photo = await getPhoto(id)

    if (!photo) {
        notFound()
    }

    const isStandalone = !photo.albumId
    const backUrl = isStandalone ? "/gallery" : `/gallery/${photo.album?.slug}`
    const backLabel = isStandalone ? "Kembali ke Galeri" : `Kembali ke Album: ${photo.album?.title}`

    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Header Section */}
            <div className="bg-primary pt-32 pb-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex justify-center mb-6">
                        <Breadcrumb
                            items={
                                isStandalone
                                    ? [
                                        { label: "Galeri", href: "/gallery" },
                                        { label: photo.title || "Foto" }
                                    ]
                                    : [
                                        { label: "Galeri", href: "/gallery" },
                                        { label: photo.album?.title || "Album", href: `/gallery/${photo.album?.slug}` },
                                        { label: photo.title || "Foto" }
                                    ]
                            }
                        />
                    </div>
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
                        {isStandalone ? "Foto Lepas" : "Foto Album"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{photo.title || "Foto Dokumentasi"}</h1>
                    <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(photo.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Admin FK3i
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                    {/* Photo Display */}
                    <div className="relative aspect-video w-full mb-8 rounded-xl overflow-hidden bg-gray-100">
                        <Image src={photo.url} alt={photo.title || "Foto"} fill className="object-contain" priority />
                    </div>

                    {/* Description */}
                    {photo.description && (
                        <div className="mb-8 max-w-3xl mx-auto text-center">
                            <p className="text-muted-foreground leading-relaxed text-lg">{photo.description}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                        <Button variant="outline" className="px-8 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                            Download Foto High-Res
                        </Button>
                        <Link href={backUrl}>
                            <Button variant="ghost" className="px-8 text-muted-foreground hover:text-primary hover:bg-primary/5">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {backLabel}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
