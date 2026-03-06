"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from "@tanstack/react-table"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, Plus, Tag, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { DeleteConfirmDialog } from "./delete-dialog"
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/categories/actions"

interface Category {
    id: string
    name: string
    slug: string
    _count?: { news: number }
    createdAt: Date
}

export function CategoriesTable({ data }: { data: Category[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
    const [formName, setFormName] = React.useState("")
    const router = useRouter()

    const handleOpenCreate = () => {
        setEditingCategory(null)
        setFormName("")
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category)
        setFormName(category.name)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const form = new FormData()
        form.append("name", formName)
        const result = editingCategory
            ? await updateCategory(editingCategory.id, null, form)
            : await createCategory(null, form)
        setIsLoading(false)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(result?.message || "Berhasil menyimpan kategori")
            setIsDialogOpen(false)
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

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Nama Kategori <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.original.slug}</code>,
        },
        {
            id: "count",
            header: () => <div className="text-center">Jumlah Berita</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant="secondary">{row.original._count?.news || 0}</Badge>
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(row.original)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <DeleteConfirmDialog
                        title="Hapus Kategori?"
                        description={`Apakah Anda yakin ingin menghapus kategori "${row.original.name}"?`}
                        onConfirm={() => handleDelete(row.original.id)}
                        trigger={
                            <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        }
                    />
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, pagination },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <Input
                    placeholder="Cari kategori..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                    className="max-w-xs"
                />
                <Button onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
                </Button>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead key={h.id}>
                                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data kategori.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} kategori
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Per halaman</span>
                        <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(v) => table.setPageSize(Number(v))}>
                            <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {[10, 20, 50].map((s) => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <span className="text-sm">Hal {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>

            {/* Dialog create/edit */}
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
                                <Label htmlFor="name" className="text-right">Nama</Label>
                                <Input
                                    id="name"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Contoh: Berita Nasional"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
