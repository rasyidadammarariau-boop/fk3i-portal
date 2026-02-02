"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ImageIcon, Folder, Image as ImageIconLucide } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { deleteGalleryAlbum, deleteGalleryAlbums, deleteGalleryImage, deleteGalleryImages } from "@/app/admin/gallery/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function GalleryTable({
    albums,
    images,
    startIndex
}: {
    albums: any[],
    images: any[],
    startIndex: number
}) {
    const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])
    const [selectedImageIds, setSelectedImageIds] = useState<string[]>([])

    // Deleting state
    const [deletingId, setDeletingId] = useState<string | null>(null) // Album ID
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null) // Image ID
    const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false)

    const router = useRouter()

    // --- SELECTION LOGIC ---

    const toggleSelectAllAlbums = () => {
        if (selectedAlbumIds.length === albums.length) {
            setSelectedAlbumIds([])
        } else {
            setSelectedAlbumIds(albums.map(item => item.id))
        }
    }

    const toggleSelectAlbum = (id: string) => {
        if (selectedAlbumIds.includes(id)) {
            setSelectedAlbumIds(selectedAlbumIds.filter(item => item !== id))
        } else {
            setSelectedAlbumIds([...selectedAlbumIds, id])
        }
    }

    // --- IMAGE SELECTION LOGIC ---

    const toggleSelectAllImages = () => {
        if (selectedImageIds.length === images.length) {
            setSelectedImageIds([])
        } else {
            setSelectedImageIds(images.map(item => item.id))
        }
    }

    const toggleSelectImage = (id: string) => {
        if (selectedImageIds.includes(id)) {
            setSelectedImageIds(selectedImageIds.filter(item => item !== id))
        } else {
            setSelectedImageIds([...selectedImageIds, id])
        }
    }

    // Image selection logic (if needed in future, but let's stick to Album bulk for now or both?)
    // User request was "checklist" (generalized). Let's just handle Albums for bulk actions to be safe and consistent with previous step, 
    // OR handle both if user selects.
    // Let's simplified: Two separate tables? Or one list?
    // Hybrid view in one table is messy because columns differ.
    // Let's Show: 
    // 1. Albums Table
    // 2. Standalone Images Table (if any)

    // --- ACTIONS ---

    const handleDeleteAlbum = async () => {
        if (!deletingId) return
        try {
            await deleteGalleryAlbum(deletingId)
            toast.success("Album berhasil dihapus")
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus album")
        } finally {
            setDeletingId(null)
        }
    }

    const handleDeleteImage = async () => {
        if (!deletingImageId) return
        try {
            await deleteGalleryImage(deletingImageId)
            toast.success("Foto berhasil dihapus")
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus foto")
        } finally {
            setDeletingImageId(null)
        }
    }

    const handleBulkDeleteAlbums = async () => {
        try {
            await deleteGalleryAlbums(selectedAlbumIds)
            toast.success(`${selectedAlbumIds.length} album dihapus`)
            setSelectedAlbumIds([])
            setShowBulkDeleteAlert(false)
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus album terpilih")
        }
    }

    const handleBulkDeleteImages = async () => {
        try {
            await deleteGalleryImages(selectedImageIds)
            toast.success(`${selectedImageIds.length} foto dihapus`)
            setSelectedImageIds([])
            setShowBulkDeleteAlert(false) // Reusing same alert or create new one? 
            // Better to have separate logic or just generic "Deleting...". 
            // Reusing alert state for simplicity but needs mode. 
            // Or better, distinct functions.
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus foto terpilih")
        }
    }

    // --- RENDER HELPERS ---
    const [bulkDeleteMode, setBulkDeleteMode] = useState<'ALBUMS' | 'IMAGES'>('ALBUMS')

    return (
        <div className="space-y-8">

            {/* --- ALBUMS TABLE --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Folder className="w-5 h-5 text-blue-600" />
                        Album ({albums.length})
                    </h2>
                    {selectedAlbumIds.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setBulkDeleteMode('ALBUMS')
                                setShowBulkDeleteAlert(true)
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus {selectedAlbumIds.length} Album
                        </Button>
                    )}
                </div>

                <div className="border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={albums.length > 0 && selectedAlbumIds.length === albums.length}
                                        onCheckedChange={toggleSelectAllAlbums}
                                    />
                                </TableHead>
                                <TableHead className="w-[80px]">Cover</TableHead>
                                <TableHead>Nama Album</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal Kegiatan</TableHead>
                                <TableHead>Jumlah Foto</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albums.length > 0 ? (
                                albums.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors" data-state={selectedAlbumIds.includes(item.id) ? "selected" : undefined}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedAlbumIds.includes(item.id)}
                                                onCheckedChange={() => toggleSelectAlbum(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                                {item.cover ? (
                                                    <Image src={item.cover} alt="Cover" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-blue-300 bg-blue-50">
                                                        <Folder className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/gallery/${item.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                                {item.title}
                                            </Link>
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                            )}
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
                                            <span className="text-sm text-gray-600 gap-2 flex items-center">
                                                {new Date(item.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {item._count?.images || 0} Foto
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/gallery/${item.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => setDeletingId(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        Tidak ada album.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* --- IMAGES TABLE --- */}
            {images.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <ImageIconLucide className="w-5 h-5 text-gray-600" />
                            Foto Lepas ({images.length})
                        </h2>
                        {selectedImageIds.length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setBulkDeleteMode('IMAGES')
                                    setShowBulkDeleteAlert(true)
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus {selectedImageIds.length} Foto
                            </Button>
                        )}
                    </div>

                    <div className="border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={images.length > 0 && selectedImageIds.length === images.length}
                                            onCheckedChange={toggleSelectAllImages}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[80px]">Preview</TableHead>
                                    <TableHead>Judul / Nama File</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal Upload</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {images.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors" data-state={selectedImageIds.includes(item.id) ? "selected" : undefined}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedImageIds.includes(item.id)}
                                                onCheckedChange={() => toggleSelectImage(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                                {/* Ensure image has src or fallback */}
                                                <Image src={item.url} alt="Preview" fill className="object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.title || "Tanpa Judul"}
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
                                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/gallery/image/${item.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => setDeletingImageId(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* --- ALERTS --- */}

            <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Album?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Album ini beserta semua isinya akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAlbum} className="bg-red-600 hover:bg-red-700 text-white">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingImageId} onOpenChange={() => setDeletingImageId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Foto ini akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage} className="bg-red-600 hover:bg-red-700 text-white">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showBulkDeleteAlert} onOpenChange={setShowBulkDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {bulkDeleteMode === 'ALBUMS'
                                ? `Hapus ${selectedAlbumIds.length} Album?`
                                : `Hapus ${selectedImageIds.length} Foto?`
                            }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {bulkDeleteMode === 'ALBUMS'
                                ? "Tindakan ini tidak dapat dibatalkan. Album yang dipilih beserta isinya akan dihapus permanen."
                                : "Tindakan ini tidak dapat dibatalkan. Foto yang dipilih akan dihapus permanen."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={bulkDeleteMode === 'ALBUMS' ? handleBulkDeleteAlbums : handleBulkDeleteImages}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Hapus Semua
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
