"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { deleteAgendaBulk } from "@/app/admin/actions"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "./delete-dialog"

export function AgendaTable({
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
        const result = await deleteAgendaBulk(selectedIds)
        setIsDeleting(false)

        if (result.success) {
            setSelectedIds([])
            toast.success(`Berhasil menghapus ${selectedIds.length} agenda`)
        } else {
            toast.error(result.error || "Gagal menghapus agenda")
        }
    }

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="bg-muted/50 p-2 rounded-lg flex items-center justify-between border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 px-4">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {selectedIds.length} item dipilih
                    </span>
                    <DeleteConfirmDialog
                        title={`Hapus ${selectedIds.length} Agenda?`}
                        description="Agenda yang dihapus tidak dapat dikembalikan lagi."
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
            )}

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
                            <TableHead className="w-[80px]">Poster</TableHead>
                            <TableHead>Nama Kegiatan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Pelaksanaan</TableHead>
                            <TableHead>Lokasi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors" data-state={selectedIds.includes(item.id) ? "selected" : undefined}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(item.id)}
                                            onCheckedChange={() => toggleSelect(item.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {startIndex + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative w-12 h-16 rounded overflow-hidden bg-gray-100 border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt="Poster" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                    <MapPin className="w-6 h-6" /> {/* Placeholder icon */}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium font-serif">
                                        {item.title}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.published
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}>
                                            {item.published ? "Published" : "Draft"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <MapPin className="w-3.5 h-3.5" /> {item.location}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/agenda/${item.id}/edit`}>
                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteConfirmDialog
                                                title="Hapus Agenda?"
                                                description={`Apakah Anda yakin ingin menghapus "${item.title}"?`}
                                                onConfirm={async () => {
                                                    const result = await deleteAgendaBulk([item.id])
                                                    if (result.success) {
                                                        toast.success("Agenda berhasil dihapus")
                                                    } else {
                                                        toast.error("Gagal menghapus agenda")
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
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
