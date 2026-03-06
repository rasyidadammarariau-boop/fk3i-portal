import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { NewsTable } from "@/components/admin/news-table"
import { SearchToolbar } from "@/components/admin/search-toolbar"
import { StatusFilter } from "@/components/admin/filters"

const ITEMS_PER_PAGE = 10

async function getNews(query: string, page: number, publishedFilter?: string) {
    const skip = (page - 1) * ITEMS_PER_PAGE

    const where: { title?: { contains?: string }, published?: boolean } = {
        title: { contains: query }
    }
    if (publishedFilter === 'published') where.published = true
    else if (publishedFilter === 'draft') where.published = false

    try {
        const [data, total] = await Promise.all([
            prisma.news.findMany({
                where,
                orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                take: ITEMS_PER_PAGE,
                skip,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    publishedAt: true,
                    published: true,
                    featured: true,
                    readTime: true,
                    attachmentUrl: true,
                }
            }),
            prisma.news.count({ where })
        ])
        return { data, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) }
    } catch {
        return { data: [], total: 0, totalPages: 0 }
    }
}

export default async function AdminNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; status?: string }>
}) {
    const { q, page, status } = await searchParams
    const query = q || ""
    const currentPage = Number(page) || 1

    const { data: newsList, totalPages } = await getNews(query, currentPage, status)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Berita &amp; Artikel</h1>
                    <p className="text-muted-foreground mt-1">Kelola semua berita dan artikel yang ditampilkan di website.</p>
                </div>
                <Link href="/admin/news/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Tambah Berita
                    </Button>
                </Link>
            </div>

            <SearchToolbar placeholder="Cari berita...">
                <StatusFilter />
            </SearchToolbar>

            <NewsTable data={newsList} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} />

            <div className="pb-8">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
