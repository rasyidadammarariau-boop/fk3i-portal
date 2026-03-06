import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Images } from "lucide-react"

export const metadata: Metadata = {
    title: 'Arsip Pergerakan',
    description: 'Dokumentasi jejak pergerakan, aksi, audiensi, dan konsolidasi BEM Pesantren Indonesia di berbagai daerah.',
}


const FILTER_TABS: [string, string][] = [
    ["", "Semua Arsip"],
    ["aksi", "Aksi"],
    ["audiensi", "Audiensi"],
    ["silatnas", "Silatnas"],
    ["kajian", "Kajian"],
    ["pengabdian", "Pengabdian"],
    ["kegiatan", "Kegiatan Umum"],
]

async function getAlbums(type?: string) {
    try {
        return await prisma.galleryAlbum.findMany({
            where: {
                published: true,
                ...(type ? { activityType: type } : {}),
            },
            orderBy: { eventDate: 'desc' },
            include: {
                _count: { select: { images: true } }
            }
        })
    } catch {
        return []
    }
}

export default async function GalleryPage({
    searchParams,
}: {
    searchParams?: Promise<{ type?: string }>
}) {
    const params = await searchParams
    const typeFilter = params?.type || ""

    const albums = await getAlbums(typeFilter)

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="bg-background border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                    <Badge variant="outline" className="font-bold tracking-widest uppercase text-xs md:text-sm mb-3 md:mb-4 block max-w-max mx-auto">
                        Dokumentasi Pergerakan
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-3 md:mb-4">Arsip Pergerakan</h1>
                    <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light text-muted-foreground">
                        Rekam jejak aksi, audiensi, konsolidasi, dan pengabdian mahasiswa santri Indonesia.
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="container mx-auto px-6 mt-8 flex flex-wrap gap-2 justify-center">
                {FILTER_TABS.map(([val, label]) => (
                    <Link
                        key={val}
                        href={val ? `/gallery?type=${val}` : "/gallery"}
                        className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${typeFilter === val
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground/30"
                            }`}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 md:px-6 mt-12">
                {albums.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {albums.map((album: Awaited<ReturnType<typeof getAlbums>>[0]) => {
                            return (
                                <Link key={album.id} href={`/gallery/${album.slug}`} className="group outline-none">
                                    <Card className="rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-border/50">
                                        {/* Cover Image */}
                                        <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                                            {album.cover ? (
                                                <Image
                                                    src={album.cover}
                                                    alt={album.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30 font-serif text-3xl">
                                                    BEM Pesantren
                                                </div>
                                            )}
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Activity Type Badge */}
                                            {album.activityType && (
                                                <div className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-background/80 text-foreground backdrop-blur border border-border/50 capitalize">
                                                    {album.activityType}
                                                </div>
                                            )}

                                            {/* Photo Count */}
                                            {album._count.images > 0 && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur">
                                                    <Images className="w-3 h-3" />
                                                    {album._count.images}
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-5">
                                            {/* Date & Location */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2.5">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(album.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                                </span>
                                                {album.location && (
                                                    <span className="flex items-center gap-1 text-primary font-semibold">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {album.location}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-serif font-bold text-base md:text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {album.title}
                                            </h3>
                                            {album.description && (
                                                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{album.description}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">
                            {typeFilter
                                ? `Belum ada arsip untuk jenis kegiatan "${typeFilter}".`
                                : "Belum ada arsip pergerakan yang terdokumentasi."}
                        </p>
                        <Link href="/gallery" className="text-primary text-sm font-bold mt-3 inline-block hover:underline">
                            ← Lihat semua arsip
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
