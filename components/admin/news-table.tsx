"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { deleteNewsBulk } from "@/app/admin/actions"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "./delete-dialog"

export function NewsTable({
    data,
    startIndex
}: {
    data: any[],
    startIndex: number
}) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isDeleting, setIsDeleting] = useState(false)

    const toggleSelectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(data.map(item => item.id))
        }
    }

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleBulkDelete = async () => {
        // Confirm handled by dialog
        setIsDeleting(true)
        const result = await deleteNewsBulk(selectedIds)
        setIsDeleting(false)

        if (result.success) {
            setSelectedIds([])
            toast.success(`Berhasil menghapus ${selectedIds.length} berita`)
        } else {
            toast.error(result.error || "Gagal menghapus berita")
        }
    }

    return (
        <div className="space-y-4">
            <div className="bg-muted/50 p-2 rounded-lg flex items-center justify-between border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 px-4">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {selectedIds.length} item dipilih
                </span>
                <DeleteConfirmDialog
                    title={`Hapus ${selectedIds.length} Berita?`}
                    description="Berita yang dihapus tidak dapat dikembalikan lagi."
                    onConfirm={handleBulkDelete}
                    isDeleting={isDeleting}
                    trigger={
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            className="h-8"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus Terpilih
                        </Button>
                    }
                />
            </div>

            <div className="border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead className="w-[400px]">Judul</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((news, index) => (
                                <TableRow key={news.id} className="hover:bg-gray-50/50 transition-colors" data-state={selectedIds.includes(news.id) ? "selected" : undefined}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(news.id)}
                                            onCheckedChange={() => toggleSelect(news.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {startIndex + index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="line-clamp-2 font-serif text-base">{news.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1 font-sans">{news.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(news.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${news.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                            {news.published ? 'Terbit' : 'Draft'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/news/${news.id}/edit`}>
                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <DeleteConfirmDialog
                                                title="Hapus Berita?"
                                                description={`Apakah Anda yakin ingin menghapus "${news.title}"?`}
                                                onConfirm={async () => {
                                                    const result = await deleteNewsBulk([news.id])
                                                    if (result.success) {
                                                        toast.success("Berita berhasil dihapus")
                                                    } else {
                                                        toast.error("Gagal menghapus berita")
                                                    }
                                                }}
                                                trigger={
                                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
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
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}
