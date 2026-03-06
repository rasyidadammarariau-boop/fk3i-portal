import { NewsForm } from "@/components/admin/news-form"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CreateNewsPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-[1800px] mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/news">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight  ">Buat Berita Baru</h1>
                    <p className="">Isi formulir berikut untuk menerbitkan artikel.</p>
                </div>
            </div>

            <NewsForm categories={categories} />
        </div>
    )
}

