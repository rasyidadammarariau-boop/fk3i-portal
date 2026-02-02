import prisma from "@/lib/prisma"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Galeri Dokumentasi',
    description: 'Kumpulan dokumentasi foto kegiatan Kyai Kampung di berbagai daerah.',
}

async function getGallery() {
    try {
        const [albums, standaloneImages] = await Promise.all([
            prisma.galleryAlbum.findMany({
                where: { published: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.galleryImage.findMany({
                where: {
                    published: true,
                    albumId: null
                },
                orderBy: { createdAt: 'desc' }
            })
        ])

        // Combine and format
        const galleryItems = [
            ...albums.map(album => ({
                id: album.id,
                title: album.title,
                description: album.description,
                image: album.cover,
                type: 'album' as const,
                slug: album.slug,
                createdAt: album.createdAt
            })),
            ...standaloneImages.map(img => ({
                id: img.id,
                title: img.title || 'Foto',
                description: img.description,
                image: img.url,
                type: 'image' as const,
                slug: img.id,
                createdAt: img.createdAt
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return galleryItems
    } catch (e) {
        return []
    }
}

export default async function GalleryPage() {
    const gallery = await getGallery()

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Header */}
            <div className="bg-primary pt-32 pb-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Dokumentasi</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Galeri Kegiatan</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto font-light">Merekam jejak langkah perjuangan dan kebersamaan.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-16 relative z-20">
                <div className="bg-white p-6 rounded-2xl shadow-xl min-h-[60vh]">
                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gallery.map((item, index) => (
                                <Link
                                    href={item.type === 'album' ? `/gallery/${item.slug}` : `/gallery/photo/${item.slug}`}
                                    key={item.id}
                                    className="group break-inside-avoid relative mb-6 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 block"
                                >
                                    <div className="relative aspect-[4/3] w-full">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/30 font-serif text-4xl">FK3i</div>
                                        )}
                                        {/* Type Badge */}
                                        <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur-sm text-primary text-xs font-bold uppercase px-3 py-1 rounded-full">
                                            {item.type === 'album' ? 'Album' : 'Foto'}
                                        </div>
                                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                                            <h3 className="text-white font-serif text-xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-white/80 text-sm font-sans translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 line-clamp-3">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            <p>Belum ada dokumentasi kegiatan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
