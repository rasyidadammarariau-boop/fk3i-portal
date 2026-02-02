import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Image as ImageIcon } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { SearchToolbar } from "@/components/admin/search-toolbar"
import { GalleryTable } from "@/components/admin/gallery-table"
import { GalleryFilter } from "@/components/admin/gallery-filter"

const ITEMS_PER_PAGE = 12

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string, year?: string }> }) {
    const { q, page, year } = await searchParams
    const query = q || ""
    const currentPage = Number(page) || 1
    const yearFilter = year ? Number(year) : undefined

    const skip = (currentPage - 1) * ITEMS_PER_PAGE

    // Fetch distinct years from albums for the filter
    const allAlbums = await prisma.galleryAlbum.findMany({
        select: { eventDate: true },
        orderBy: { eventDate: 'desc' }
    })

    const years = Array.from(new Set(allAlbums.map(album => new Date(album.eventDate).getFullYear())))

    // Construct Where Clause
    const albumWhere: any = {
        title: { contains: query },
        ...(yearFilter && {
            eventDate: {
                gte: new Date(`${yearFilter}-01-01`),
                lt: new Date(`${yearFilter + 1}-01-01`)
            }
        })
    }

    // For images, we can't easily filter by year if they are standalone (created_at) unless requested.
    // For now, let's only apply year filter to Albums as requested "Filter (Tahun)".
    // If year filter is active, maybe we hide standalone images or filter them by createdAt?
    // Let's filter standalone images by createdAt too if year is selected.

    const imageWhere: any = {
        albumId: null,
        title: { contains: query },
        ...(yearFilter && {
            createdAt: {
                gte: new Date(`${yearFilter}-01-01`),
                lt: new Date(`${yearFilter + 1}-01-01`)
            }
        })
    }

    const [albums, images, totalAlbums, totalImages] = await Promise.all([
        prisma.galleryAlbum.findMany({
            where: albumWhere,
            orderBy: { eventDate: 'desc' },
            take: ITEMS_PER_PAGE,
            skip: skip,
            include: { _count: { select: { images: true } } }
        }),
        prisma.galleryImage.findMany({
            where: imageWhere,
            orderBy: { createdAt: 'desc' },
            take: ITEMS_PER_PAGE,
            skip: skip
        }),
        prisma.galleryAlbum.count({ where: albumWhere }),
        prisma.galleryImage.count({ where: imageWhere })
    ])

    const totalPages = Math.ceil((totalAlbums + totalImages) / ITEMS_PER_PAGE)

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Galeri</h1>
                    <p className="text-muted-foreground">Kelola album foto dan dokumentasi kegiatan.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/gallery/new-image">
                        <Button variant="outline" className="gap-2">
                            <ImageIcon className="w-4 h-4" /> Upload Foto
                        </Button>
                    </Link>
                    <Link href="/admin/gallery/new">
                        <Button className="gap-2 shadow-lg">
                            <Plus className="w-4 h-4" /> Buat Album
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <SearchToolbar placeholder="Cari album atau foto...">
                    <GalleryFilter years={years} />
                </SearchToolbar>

                <GalleryTable albums={albums} images={images} startIndex={skip} />

                <div className="pb-8 mt-4">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}
