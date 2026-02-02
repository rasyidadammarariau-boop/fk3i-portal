'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteCategory, toggleCategoryPublished } from "@/app/admin/message-categories/actions"
import { toast } from "sonner"

interface MessageCategoryTableProps {
    categories: any[]
}

export function MessageCategoryTable({ categories }: MessageCategoryTableProps) {
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus kategori "${name}"?`)) return

        const result = await deleteCategory(id)
        if (result.success) {
            toast.success('Kategori berhasil dihapus')
        } else {
            toast.error(result.error || 'Gagal menghapus kategori')
        }
    }

    const handleTogglePublished = async (id: string, currentStatus: boolean) => {
        const result = await toggleCategoryPublished(id, !currentStatus)
        if (result.success) {
            toast.success('Status berhasil diupdate')
        } else {
            toast.error(result.error || 'Gagal mengupdate status')
        }
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Belum ada kategori</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{category.name}</h3>
                            <Badge variant={category.published ? "default" : "secondary"}>
                                {category.published ? "Aktif" : "Nonaktif"}
                            </Badge>
                            <Badge variant="outline">{category._count.messages} pesan</Badge>
                        </div>
                        {category.description && (
                            <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Slug: <code className="bg-gray-100 px-2 py-1 rounded">{category.slug}</code></span>
                            {category.icon && <span>Icon: {category.icon}</span>}
                            <span>Order: {category.order}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublished(category.id, category.published)}
                        >
                            {category.published ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Link href={`/admin/message-categories/${category.id}/edit`}>
                            <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id, category.name)}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
