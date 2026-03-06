import prisma from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"

import { Breadcrumb } from "@/components/ui/breadcrumb-custom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

async function getGalleryItem(slug: string) {
    try {
        return await prisma.galleryAlbum.findUnique({
            where: { slug },
            include: { images: true }
        })
    } catch {
        return null
    }
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const item = await getGalleryItem(slug)

    if (!item) {
        notFound()
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Header Section */}
            <div className=" pt-32 pb-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex justify-center mb-6">
                        <Breadcrumb
                            items={[
                                { label: "Galeri", href: "/gallery" },
                                { label: item.title }
                            ]}
                        />
                    </div>
                    <Badge variant="secondary" className="font-bold tracking-widest uppercase text-xs md:text-sm mb-3 md:mb-4 block max-w-max mx-auto">Album Dokumentasi</Badge>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-4">{item.title}</h1>
                    <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Admin BEM Pesantren Indonesia
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
                <Card className="rounded-2xl shadow-xl border-none">
                    <CardContent className="p-8 md:p-12">
                        {/* Album Cover */}
                        {item.cover && (
                            <div className="relative aspect-video w-full mb-8 rounded-xl overflow-hidden bg-muted">
                                <Image src={item.cover} alt={item.title} fill className="object-cover" priority />
                            </div>
                        )}

                        {/* Description */}
                        {item.description && (
                            <div className="mb-12 max-w-3xl">
                                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Tentang Album Ini</h2>
                                <p className=" leading-relaxed">{item.description}</p>
                            </div>
                        )}

                        {/* Photo Grid */}
                        {item.images && item.images.length > 0 && (
                            <div>
                                <div className="flex justify-between items-center mb-4 md:mb-6">
                                    <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">
                                        Foto dalam Album ({item.images.filter(img => img.published).length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {item.images.filter(img => img.published).map(photo => (
                                        <Link
                                            key={photo.id}
                                            href={`/gallery/photo/${photo.id}`}
                                            className="group relative block outline-none"
                                        >
                                            <Card className="aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none">
                                                <CardContent className="p-0 h-full">
                                                    <Image src={photo.url} alt={photo.title || "Foto"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    {photo.title && (
                                                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                                                            <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                                <h3 className="text-white font-serif text-lg font-bold">{photo.title}</h3>
                                                                {photo.description && (
                                                                    <p className="text-white/80 text-sm mt-2 line-clamp-2">{photo.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back Button */}
                        <div className="mt-12 text-center">
                            <Link href="/gallery">
                                <Button variant="outline" className="px-8 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali ke Galeri
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
