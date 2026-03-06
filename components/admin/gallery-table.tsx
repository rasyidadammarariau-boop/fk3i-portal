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
    type SortingState,
} from "@tanstack/react-table"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, Folder, Image as ImageIconLucide, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    deleteGalleryAlbum, deleteGalleryAlbums, deleteGalleryImage, deleteGalleryImages,
} from "@/app/admin/gallery/actions"

type Album = { id: string; title: string; description: string | null; eventDate: Date | string; cover: string | null; published: boolean; _count?: { images: number } }
type GalleryImage = { id: string; url: string; title: string | null; createdAt: Date | string; published: boolean }

export function GalleryTable({
    albums,
    images,
    startIndex: _startIndex,
}: {
    albums: Album[]
    images: GalleryImage[]
    startIndex: number
}) {
    const [albumSorting, setAlbumSorting] = React.useState<SortingState>([])
    const [imageSorting, setImageSorting] = React.useState<SortingState>([])
    const [albumFilter, setAlbumFilter] = React.useState("")
    const [imageFilter, setImageFilter] = React.useState("")
    const [albumRowSelection, setAlbumRowSelection] = React.useState({})
    const [imageRowSelection, setImageRowSelection] = React.useState({})
    const [deletingAlbumId, setDeletingAlbumId] = React.useState<string | null>(null)
    const [deletingImageId, setDeletingImageId] = React.useState<string | null>(null)
    const [bulkMode, setBulkMode] = React.useState<"ALBUMS" | "IMAGES">("ALBUMS")
    const [showBulkAlert, setShowBulkAlert] = React.useState(false)

    const router = useRouter()

    // ---- Album columns ----
    const albumColumns: ColumnDef<Album>[] = [
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
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Pilih" />
                </div>
            ),
            enableSorting: false,
        },
        {
            id: "cover",
            header: "Cover",
            cell: ({ row }) => (
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border">
                    {row.original.cover ? (
                        <Image src={row.original.cover} alt="Cover" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Folder className="w-5 h-5 text-muted-foreground" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Nama Album <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <Link href={`/admin/gallery/${row.original.id}`} className="font-medium hover:underline">
                        {row.original.title}
                    </Link>
                    {row.original.description && <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>}
                </div>
            ),
        },
        {
            accessorKey: "published",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.published ? "default" : "secondary"}>
                    {row.original.published ? "Published" : "Draft"}
                </Badge>
            ),
        },
        {
            accessorKey: "eventDate",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Tgl Kegiatan <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
            ),
        },
        {
            id: "count",
            header: () => <div className="text-center">Foto</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant="secondary">{row.original._count?.images || 0}</Badge>
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/gallery/${row.original.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setDeletingAlbumId(row.original.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ]

    // ---- Image columns ----
    const imageColumns: ColumnDef<GalleryImage>[] = [
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
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Pilih" />
                </div>
            ),
        },
        {
            id: "preview",
            header: "Preview",
            cell: ({ row }) => (
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border">
                    <Image src={row.original.url} alt="Preview" fill className="object-cover" />
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Judul / Nama File",
            cell: ({ row }) => <span className="font-medium">{row.original.title || "Tanpa Judul"}</span>,
        },
        {
            accessorKey: "published",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.published ? "default" : "secondary"}>
                    {row.original.published ? "Published" : "Draft"}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 font-semibold">
                    Tgl Upload <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/gallery/image/${row.original.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setDeletingImageId(row.original.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ]

    const albumTable = useReactTable({
        data: albums,
        columns: albumColumns,
        state: { sorting: albumSorting, rowSelection: albumRowSelection, globalFilter: albumFilter },
        enableRowSelection: true,
        onRowSelectionChange: setAlbumRowSelection,
        onSortingChange: setAlbumSorting,
        onGlobalFilterChange: setAlbumFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const imageTable = useReactTable({
        data: images,
        columns: imageColumns,
        state: { sorting: imageSorting, rowSelection: imageRowSelection, globalFilter: imageFilter },
        enableRowSelection: true,
        onRowSelectionChange: setImageRowSelection,
        onSortingChange: setImageSorting,
        onGlobalFilterChange: setImageFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const selectedAlbumIds = albumTable.getSelectedRowModel().rows.map((r) => r.original.id)
    const selectedImageIds = imageTable.getSelectedRowModel().rows.map((r) => r.original.id)

    const handleDeleteAlbum = async () => {
        if (!deletingAlbumId) return
        try {
            await deleteGalleryAlbum(deletingAlbumId)
            toast.success("Album berhasil dihapus")
            router.refresh()
        } catch {
            toast.error("Gagal menghapus album")
        } finally {
            setDeletingAlbumId(null)
        }
    }

    const handleDeleteImage = async () => {
        if (!deletingImageId) return
        try {
            await deleteGalleryImage(deletingImageId)
            toast.success("Foto berhasil dihapus")
            router.refresh()
        } catch {
            toast.error("Gagal menghapus foto")
        } finally {
            setDeletingImageId(null)
        }
    }

    const handleBulkDelete = async () => {
        try {
            if (bulkMode === "ALBUMS") {
                await deleteGalleryAlbums(selectedAlbumIds)
                toast.success(`${selectedAlbumIds.length} album dihapus`)
                setAlbumRowSelection({})
            } else {
                await deleteGalleryImages(selectedImageIds)
                toast.success(`${selectedImageIds.length} foto dihapus`)
                setImageRowSelection({})
            }
            setShowBulkAlert(false)
            router.refresh()
        } catch {
            toast.error("Gagal menghapus")
        }
    }

    return (
        <div className="space-y-10">
            {/* ALBUMS TABLE */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Folder className="w-5 h-5" /> Album ({albums.length})
                        </h2>
                        <Input
                            placeholder="Cari album..."
                            value={albumFilter}
                            onChange={(e) => setAlbumFilter(e.target.value)}
                            className="w-48 h-8"
                        />
                    </div>
                    {selectedAlbumIds.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={() => { setBulkMode("ALBUMS"); setShowBulkAlert(true) }}>
                            <Trash2 className="w-4 h-4 mr-2" /> Hapus {selectedAlbumIds.length} Album
                        </Button>
                    )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {albumTable.getHeaderGroups().map((hg) => (
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
                            {albumTable.getRowModel().rows.length ? (
                                albumTable.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={albumColumns.length} className="h-24 text-center">Tidak ada album.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <PaginationBar table={albumTable} />
            </div>

            {/* IMAGES TABLE */}
            {images.length > 0 && (
                <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ImageIconLucide className="w-5 h-5" /> Foto Lepas ({images.length})
                            </h2>
                            <Input
                                placeholder="Cari foto..."
                                value={imageFilter}
                                onChange={(e) => setImageFilter(e.target.value)}
                                className="w-48 h-8"
                            />
                        </div>
                        {selectedImageIds.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={() => { setBulkMode("IMAGES"); setShowBulkAlert(true) }}>
                                <Trash2 className="w-4 h-4 mr-2" /> Hapus {selectedImageIds.length} Foto
                            </Button>
                        )}
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {imageTable.getHeaderGroups().map((hg) => (
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
                                {imageTable.getRowModel().rows.length ? (
                                    imageTable.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50 transition-colors">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={imageColumns.length} className="h-24 text-center">Tidak ada foto lepas.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <PaginationBar table={imageTable} />
                </div>
            )}

            {/* Confirm delete album */}
            <AlertDialog open={!!deletingAlbumId} onOpenChange={() => setDeletingAlbumId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Album?</AlertDialogTitle>
                        <AlertDialogDescription>Album ini beserta semua isinya akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAlbum} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm delete image */}
            <AlertDialog open={!!deletingImageId} onOpenChange={() => setDeletingImageId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                        <AlertDialogDescription>Foto ini akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk delete confirm */}
            <AlertDialog open={showBulkAlert} onOpenChange={setShowBulkAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {bulkMode === "ALBUMS" ? `Hapus ${selectedAlbumIds.length} Album?` : `Hapus ${selectedImageIds.length} Foto?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {bulkMode === "ALBUMS"
                                ? "Album yang dipilih beserta isinya akan dihapus permanen."
                                : "Foto yang dipilih akan dihapus permanen."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus Semua</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// Shared pagination component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PaginationBar({ table }: { table: any }) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} dipilih
            </div>
            <div className="flex items-center gap-2">
                <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(v) => table.setPageSize(Number(v))}>
                    <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{[10, 20, 50].map((s) => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}</SelectContent>
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
    )
}
