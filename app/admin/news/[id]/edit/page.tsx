import { NewsForm } from "@/components/admin/news-form"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [news, categories] = await Promise.all([
        prisma.news.findUnique({
            where: { id }
        }),
        prisma.category.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!news) {
        notFound()
    }

    return (
        <div className="max-w-[1800px] mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/news">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight  dark:text-gray-100">Edit Berita</h1>
                    <p className="">Perbarui konten artikel, gambar, dan metadata.</p>
                </div>
            </div>

            <NewsForm categories={categories} initialData={news} />
        </div>
    )
}
