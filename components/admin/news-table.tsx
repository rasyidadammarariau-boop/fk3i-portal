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
    type VisibilityState,
} from "@tanstack/react-table"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Star, Clock, Paperclip } from "lucide-react"
import Link from "next/link"
import { deleteNewsBulk, toggleFeatured } from "@/app/admin/actions"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "./delete-dialog"
import { useRouter } from "next/navigation"

type NewsItem = {
    id: string
    title: string
    slug: string
    createdAt: Date | string
    publishedAt?: Date | string | null
    published: boolean
    featured?: boolean
    readTime?: number | null
    attachmentUrl?: string | null
}

export function NewsTable({ data, startIndex: _startIndex }: { data: NewsItem[]; startIndex: number }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const router = useRouter()

    const handleToggleFeatured = async (id: string, current: boolean) => {
        const result = await toggleFeatured(id, current)
        if (result.success) {
            toast.success(current ? "Dihapus dari unggulan" : "Dijadikan berita unggulan")
            router.refresh()
        } else {
            toast.error("Gagal mengubah status unggulan")
        }
    }

    const columns: ColumnDef<NewsItem>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                        aria-label="Pilih semua"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Pilih baris" />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Judul <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <div className="flex items-center gap-1.5">
                        {row.original.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" title="Headline" />}
                        {row.original.attachmentUrl && <Paperclip className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" title="Ada Lampiran Dokumen" />}
                        <span className="font-medium line-clamp-2 font-serif">{row.original.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{row.original.slug}</div>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Tanggal <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const dateSource = row.original.publishedAt || row.original.createdAt
                const date = new Date(dateSource)
                return (
                    <div className="flex flex-col text-sm">
                        <span className="font-medium">{date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        {row.original.readTime && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" /> {row.original.readTime} mnt
                            </span>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "published",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.published ? "default" : "secondary"}>
                    {row.original.published ? "Terbit" : "Draft"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${row.original.featured ? "text-amber-500" : "text-muted-foreground"}`}
                        onClick={() => handleToggleFeatured(row.original.id, row.original.featured ?? false)}
                        title={row.original.featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                    >
                        <Star className={`w-4 h-4 ${row.original.featured ? "fill-amber-500" : ""}`} />
                    </Button>
                    <Link href={`/admin/news/${row.original.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <DeleteConfirmDialog
                        title="Hapus Berita?"
                        description={`Hapus "${row.original.title}"? Tindakan ini tidak dapat dibatalkan.`}
                        onConfirm={async () => {
                            const result = await deleteNewsBulk([row.original.id])
                            if (result.success) toast.success("Berita dihapus")
                            else toast.error("Gagal menghapus")
                        }}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        }
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.id)

    const handleBulkDelete = async () => {
        setIsDeleting(true)
        const result = await deleteNewsBulk(selectedIds)
        setIsDeleting(false)
        if (result.success) {
            setRowSelection({})
            toast.success(`Berhasil menghapus ${selectedIds.length} berita`)
        } else {
            toast.error(result.error || "Gagal menghapus")
        }
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <Input
                    placeholder="Cari judul berita..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
                    className="max-w-xs"
                />
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <DeleteConfirmDialog
                            title={`Hapus ${selectedIds.length} Berita?`}
                            description="Berita yang dihapus tidak dapat dikembalikan."
                            onConfirm={handleBulkDelete}
                            isDeleting={isDeleting}
                            trigger={
                                <Button variant="destructive" size="sm" disabled={isDeleting}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Hapus ({selectedIds.length})
                                </Button>
                            }
                        />
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">Kolom <ChevronDown className="ml-2 h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} baris dipilih
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="hidden sm:inline">Baris per halaman</span>
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
        </div>
    )
}
