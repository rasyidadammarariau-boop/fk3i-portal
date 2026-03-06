import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"


async function getRecentGallery() {
    try {
        return await prisma.galleryAlbum.findMany({
            take: 5,
            orderBy: { eventDate: 'desc' },
            where: { published: true },
            select: {
                id: true, title: true, cover: true, slug: true,
                activityType: true, location: true, eventDate: true,
                _count: { select: { images: true } }
            }
        })
    } catch {
        return []
    }
}

export default async function GallerySection() {
    const recentGallery = await getRecentGallery()

    if (recentGallery.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-lg mb-2">Belum ada arsip pergerakan yang terdokumentasi.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {recentGallery.map((album: typeof recentGallery[0], i: number) => {
                return (
                    <Link
                        key={album.id}
                        href={`/gallery/${album.slug}`}
                        className={`group relative overflow-hidden bg-muted rounded-lg ${i === 0 ? "sm:col-span-2 md:col-span-2 md:row-span-2" : "md:col-span-1"}`}
                    >
                        {album.cover ? (
                            <Image
                                src={album.cover}
                                alt={album.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/30 font-serif text-4xl">BEM Pesantren Indonesia</div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Activity badge top-left */}
                        {album.activityType && (
                            <div className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground backdrop-blur capitalize">
                                {album.activityType}
                            </div>
                        )}

                        {/* Info bottom */}
                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white font-serif font-bold text-base md:text-lg leading-tight line-clamp-2 mb-1">{album.title}</h3>
                            {album.location && (
                                <span className="flex items-center gap-1 text-white/70 text-xs">
                                    <MapPin className="w-3 h-3" /> {album.location}
                                </span>
                            )}
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
