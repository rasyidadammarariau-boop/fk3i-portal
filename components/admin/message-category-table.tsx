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
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { DeleteConfirmDialog } from "./delete-dialog"
import { deleteCategory, toggleCategoryPublished } from "@/app/admin/message-categories/actions"

type MessageCategory = {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    order: number
    published: boolean
    _count: { messages: number }
}

export function MessageCategoryTable({ categories }: { categories: MessageCategory[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "order", desc: false }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const router = useRouter()

    const handleDelete = async (id: string) => {
        const result = await deleteCategory(id)
        if (result.success) {
            toast.success("Kategori berhasil dihapus")
            router.refresh()
        } else {
            toast.error(result.error || "Gagal menghapus kategori")
        }
    }

    const handleToggle = async (id: string, current: boolean) => {
        const result = await toggleCategoryPublished(id, !current)
        if (result.success) {
            toast.success("Status berhasil diupdate")
            router.refresh()
        } else {
            toast.error(result.error || "Gagal mengupdate status")
        }
    }

    const columns: ColumnDef<MessageCategory>[] = [
        {
            accessorKey: "order",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Urutan <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <span className="text-center block">{row.original.order}</span>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Nama Kategori <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    {row.original.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</div>
                    )}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded mt-0.5 inline-block">{row.original.slug}</code>
                </div>
            ),
        },
        {
            accessorKey: "published",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.published ? "default" : "secondary"}>
                    {row.original.published ? "Aktif" : "Nonaktif"}
                </Badge>
            ),
        },
        {
            id: "messages",
            header: () => <div className="text-center">Pesan</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant="outline">{row.original._count.messages}</Badge>
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(row.original.id, row.original.published)}
                    >
                        {row.original.published ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                    <Link href={`/admin/message-categories/${row.original.id}/edit`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <DeleteConfirmDialog
                        title="Hapus Kategori?"
                        description={`Hapus kategori "${row.original.name}"? Tindakan ini tidak dapat dibatalkan.`}
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
        data: categories,
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
            <Input
                placeholder="Cari kategori pesan..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                className="max-w-xs"
            />

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
                                    Belum ada kategori pesan.
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
                    <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(v) => table.setPageSize(Number(v))}>
                        <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>{[10, 20].map((s) => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <span className="text-sm">Hal {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
