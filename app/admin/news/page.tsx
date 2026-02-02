import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { NewsTable } from "@/components/admin/news-table"
import { SearchToolbar } from "@/components/admin/search-toolbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Requires client component wrapper or move to toolbar

// We need a wrapper for the select filter to be used inside the toolbar if it acts as a server component parent, 
// but SearchToolbar is client. We can pass children.

const ITEMS_PER_PAGE = 10

async function getNews(query: string, page: number, publishedFilter?: string) {
    const skip = (page - 1) * ITEMS_PER_PAGE

    // Construct where clause
    const where: any = {
        title: {
            contains: query,
        }
    }

    if (publishedFilter === 'published') { // 'processed' mapped to published=true for example, or use exact string
        where.published = true
    } else if (publishedFilter === 'draft') {
        where.published = false
    }

    try {
        const [data, total] = await Promise.all([
            prisma.news.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: ITEMS_PER_PAGE,
                skip: skip
            }),
            prisma.news.count({ where })
        ])
        return { data, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) }
    } catch (e) {
        return { data: [], total: 0, totalPages: 0 }
    }
}

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string, status?: string }> }) {
    const { q, page, status } = await searchParams
    const query = q || ""
    const currentPage = Number(page) || 1

    // Map status filter to logic
    // Actually simplicity:
    // status=published -> published=true
    // status=draft -> published=false

    const { data: newsList, totalPages } = await getNews(query, currentPage, status)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Berita & Artikel</h1>
                    <p className="text-muted-foreground">Kelola semua berita dan artikel yang ditampilkan di website.</p>
                </div>
                <Link href="/admin/news/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Tambah Berita
                    </Button>
                </Link>
            </div>

            <SearchToolbar placeholder="Cari berita...">
                {/* Filter Dropdown - We need to create a small client component for this or use a simple link-based filter if possible, 
                     but Shadcn Select is React-based. 
                     For simplicity in Server Component, we can't directly render interactive Select without generic 'use client' wrapper or being in SearchToolbar.
                     Since SearchToolbar is 'use client', we can pass interactive elements as children? Yes.
                  */}
                <StatusFilter />
            </SearchToolbar>

            <NewsTable data={newsList} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} />

            <div className="pb-8">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}

// Client component for the filter
import { StatusFilter } from "@/components/admin/filters"
