import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { MessageCategoryTable } from "@/components/admin/message-category-table"

async function getCategories() {
    try {
        return await prisma.messageCategory.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { messages: true }
                }
            }
        })
    } catch (e) {
        return []
    }
}

export default async function MessageCategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Kategori Pesan</h1>
                    <p className="text-muted-foreground">Kelola kategori untuk pesan kontak</p>
                </div>
                <Link href="/admin/message-categories/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Kategori
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Kategori</CardTitle>
                    <CardDescription>Total {categories.length} kategori</CardDescription>
                </CardHeader>
                <CardContent>
                    <MessageCategoryTable categories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}
