import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { AgendaTable } from "@/components/admin/agenda-table"
import { SearchToolbar } from "@/components/admin/search-toolbar"

const ITEMS_PER_PAGE = 10

async function getAgendas(query: string, page: number) {
    const skip = (page - 1) * ITEMS_PER_PAGE

    try {
        const [data, total] = await Promise.all([
            prisma.agenda.findMany({
                where: {
                    title: {
                        contains: query,
                    }
                },
                orderBy: { date: 'asc' },
                take: ITEMS_PER_PAGE,
                skip: skip
            }),
            prisma.agenda.count({
                where: {
                    title: {
                        contains: query,
                    }
                }
            })
        ])
        return { data, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) }
    } catch (e) {
        return { data: [], total: 0, totalPages: 0 }
    }
}

export default async function AdminAgendaPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
    const { q, page } = await searchParams
    const query = q || ""
    const currentPage = Number(page) || 1

    const { data: agendaList, totalPages } = await getAgendas(query, currentPage)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agenda Kegiatan</h1>
                    <p className="text-muted-foreground">Kelola jadwal kegiatan dan acara mendatang.</p>
                </div>
                <Link href="/admin/agenda/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Tambah Agenda
                    </Button>
                </Link>
            </div>

            <SearchToolbar placeholder="Cari agenda..." />

            <AgendaTable data={agendaList} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} />

            <div className="pb-8">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
