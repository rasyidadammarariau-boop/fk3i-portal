import prisma from "@/lib/prisma"
import Link from "next/link"
import { FileText, Image, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function searchAll(query: string) {
    if (!query || query.trim().length < 2) return null

    const q = query.trim()

    const [news, gallery] = await Promise.all([
        prisma.news.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { excerpt: { contains: q } },
                    { tags: { contains: q } },
                ]
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, slug: true, published: true, createdAt: true, categoryId: true }
        }),
        prisma.galleryAlbum.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } },
                ]
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, slug: true, published: true, createdAt: true }
        }),
    ])

    return { news, gallery, total: news.length + gallery.length }
}

export default async function AdminSearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const results = q ? await searchAll(q) : null

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight  dark:text-white">Pencarian Global</h1>
                <p className="">Cari konten di seluruh sistem</p>
            </div>

            {/* Search Form */}
            <form method="GET" className="flex gap-3">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
                    <Input
                        name="q"
                        defaultValue={q || ""}
                        placeholder="Cari berita, agenda, galeri..."
                        className="pl-9"
                        autoFocus
                    />
                </div>
                <button type="submit" className="px-4 py-2  rounded-md text-sm font-medium hover:bg-primary/90 transition">
                    Cari
                </button>
            </form>

            {/* Results */}
            {q && !results && (
                <p className=" text-sm">Masukkan minimal 2 karakter untuk mencari.</p>
            )}

            {results && (
                <div className="space-y-6">
                    <p className="text-sm ">
                        Ditemukan <strong>{results.total}</strong> hasil untuk: <strong>&quot;{q}&quot;</strong>
                    </p>

                    {/* Berita */}
                    {results.news.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4 " />
                                    Berita ({results.news.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y">
                                    {results.news.map((item: { id: string, title: string, createdAt: Date, published: boolean }) => (
                                        <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                                            <div>
                                                <Link
                                                    href={`/admin/news/${item.id}`}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-xs  mt-0.5">
                                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <Badge variant={item.published ? "default" : "secondary"}>
                                                {item.published ? "Terbit" : "Draft"}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}


                    {/* Galeri */}
                    {results.gallery.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Image className="w-4 h-4" aria-hidden="true" />
                                    Galeri ({results.gallery.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y">
                                    {results.gallery.map((item: { id: string, title: string | null, createdAt: Date, published: boolean }) => (
                                        <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                                            <div>
                                                <Link
                                                    href={`/admin/gallery/${item.id}/edit`}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-xs  mt-0.5">
                                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <Badge variant={item.published ? "default" : "secondary"}>
                                                {item.published ? "Terbit" : "Draft"}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {results.total === 0 && (
                        <div className="text-center py-16 ">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-medium">Tidak ada hasil ditemukan</p>
                            <p className="text-sm">Coba kata kunci yang berbeda</p>
                        </div>
                    )}
                </div>
            )}

            {!q && (
                <div className="text-center py-16 ">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Ketik kata kunci di atas untuk mencari konten</p>
                </div>
            )}
        </div>
    )
}

