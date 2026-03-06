import { CategoriesTable } from "@/components/admin/categories-table"
import prisma from "@/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Kategori Berita | Admin BEM Pesantren Indonesia',
    description: 'Manajemen kategori berita dan artikel',
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    // Fetch categories with news count
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { news: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight  dark:text-gray-100">Kategori Berita</h1>
                <p className="">Kelola kategori untuk pengelompokan artikel dan berita.</p>
            </div>

            <CategoriesTable data={categories} />
        </div>
    )
}

