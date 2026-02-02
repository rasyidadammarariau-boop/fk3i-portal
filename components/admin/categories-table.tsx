"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Plus, Search, Tag } from "lucide-react"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "./delete-dialog"
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/categories/actions"

interface Category {
    id: string
    name: string
    slug: string
    _count?: {
        news: number
    }
    createdAt: Date
}

interface CategoriesTableProps {
    data: Category[]
}

export function CategoriesTable({ data }: CategoriesTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({ name: "" })

    const router = useRouter()

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenCreate = () => {
        setEditingCategory(null)
        setFormData({ name: "" })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({ name: category.name })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const form = new FormData()
        form.append("name", formData.name)

        let result
        if (editingCategory) {
            result = await updateCategory(editingCategory.id, null, form)
        } else {
            result = await createCategory(null, form)
        }

        setIsLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(result?.message || "Berhasil menyimpan kategori")
            setIsDialogOpen(false)
            setEditingCategory(null)
            setFormData({ name: "" })
            router.refresh()
        }
    }

    const handleDelete = async (id: string) => {
        const result = await deleteCategory(id)
        if (result.success) {
            toast.success(result.message)
            router.refresh()
        } else {
            toast.error(result.error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari kategori..."
                        className="pl-9 dark:bg-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
                </Button>
            </div>

            <div className="border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-center">Jumlah Berita</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="text-center text-muted-foreground">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-blue-500" />
                                            {item.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                        {item.slug}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
                                            {item._count?.news || 0}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                onClick={() => handleOpenEdit(item)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>

                                            <DeleteConfirmDialog
                                                title="Hapus Kategori?"
                                                description={`Apakah Anda yakin ingin menghapus kategori "${item.name}"? Aksi ini akan gagal jika ada berita yang menggunakan kategori ini.`}
                                                onConfirm={() => handleDelete(item.id)}
                                                trigger={
                                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data kategori.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
                        <DialogDescription>
                            {editingCategory ? "Ubah nama kategori yang sudah ada." : "Buat kategori untuk mengelompokkan berita."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Contoh: Berita Nasional"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
