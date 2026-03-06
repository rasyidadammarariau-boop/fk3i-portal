import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

// Separate data fetching function
async function getStats() {
    try {
        const news = await prisma.news.count()
        const [albums, standaloneImages] = await Promise.all([
            prisma.galleryAlbum.count(),
            prisma.galleryImage.count({ where: { albumId: null } })
        ])
        const gallery = albums + standaloneImages
        return { news, gallery, members: 1540, branches: 34 }
    } catch {
        return { news: 0, gallery: 0, members: 0, branches: 0 }
    }
}

export default async function StatsSection() {
    const stats = await getStats()

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            <Card className="bg-background border-border shadow-sm">
                <CardContent className="text-center p-3 md:p-6 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-1 md:mb-2">{stats.members}</div>
                    <div className="text-[10px] md:text-sm tracking-widest uppercase text-muted-foreground">Anggota Terdaftar</div>
                </CardContent>
            </Card>
            <Card className="bg-background border-border shadow-sm">
                <CardContent className="text-center p-3 md:p-6 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-1 md:mb-2">{stats.branches}</div>
                    <div className="text-[10px] md:text-sm tracking-widest uppercase text-muted-foreground">Provinsi</div>
                </CardContent>
            </Card>
            <Card className="bg-background border-border shadow-sm">
                <CardContent className="text-center p-3 md:p-6 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-1 md:mb-2">{stats.news}</div>
                    <div className="text-[10px] md:text-sm tracking-widest uppercase text-muted-foreground">Publikasi</div>
                </CardContent>
            </Card>
            <Card className="bg-background border-border shadow-sm">
                <CardContent className="text-center p-3 md:p-6 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-1 md:mb-2">{stats.gallery}</div>
                    <div className="text-[10px] md:text-sm tracking-widest uppercase text-muted-foreground">Kegiatan</div>
                </CardContent>
            </Card>
        </div>
    )
}

