"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Image as ImageIcon, MoreVertical, Pencil, Trash, Folder, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteGalleryAlbum, deleteGalleryAlbums, deleteGalleryImage } from "@/app/admin/gallery/actions"
import { toast } from "sonner"
import { useState } from "react"
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

export function GalleryGrid({ albums, images }: { albums: any[]; images: any[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
    const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])
    // We could also support selecting images, but let's start with Albums as requested "checklist juga" usually implies similar to previous task.
    // User said "tambahkan filter dan pencarian , kemudian cheklist juga".
    // I will implementation selection for Albums primarily, or maybe both?
    // Let's implement for Albums first as that's the main container. Implementing mixed selection is complex.
    // Actually, I'll stick to Albums for bulk actions for now to avoid confusion. Or maybe I can do both if I track IDs separately.
    // Let's support Album selection.

    const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false)
    const router = useRouter()

    const handleDeleteAlbum = async () => {
        if (!deletingId) return

        try {
            await deleteGalleryAlbum(deletingId)
            toast.success("Album berhasil dihapus")
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
        } catch (error) {
            toast.error("Gagal menghapus foto")
        } finally {
            setDeletingImageId(null)
        }
    }

    const handleBulkDelete = async () => {
        try {
            await deleteGalleryAlbums(selectedAlbumIds)
            toast.success(`${selectedAlbumIds.length} album dihapus`)
            setSelectedAlbumIds([])
            setShowBulkDeleteAlert(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Gagal menghapus album terpilih")
        }
    }

    const toggleAlbumSelection = (id: string) => {
        setSelectedAlbumIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const toggleSelectAllAlbums = () => {
        if (selectedAlbumIds.length === albums.length) {
            setSelectedAlbumIds([])
        } else {
            setSelectedAlbumIds(albums.map(a => a.id))
        }
    }

    if (albums.length === 0 && images.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Galeri Kosong</h3>
                <p className="text-muted-foreground mt-1">Belum ada album maupun foto yang diupload.</p>
            </div>
        )
    }

    return (
        <>
            {/* Bulk Action Bar */}
            {selectedAlbumIds.length > 0 && (
                <div className="sticky top-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-xl border shadow-lg flex items-center justify-between mb-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">{selectedAlbumIds.length} Album Dipilih</span>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAlbumIds([])}>
                            Batal
                        </Button>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteAlert(true)}>
                        <Trash className="w-4 h-4 mr-2" />
                        Hapus Terpilih
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* --- ALBUMS --- */}
                {albums.map((album) => {
                    const isSelected = selectedAlbumIds.includes(album.id)
                    return (
                        <Card
                            key={`album-${album.id}`}
                            className={`group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800 relative ${isSelected ? 'ring-2 ring-primary' : ''}`}
                        >
                            {/* Selection Checkbox Overlay */}
                            <div className="absolute top-2 left-2 z-30">
                                <div
                                    className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-black/30 border-white hover:bg-black/50'}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleAlbumSelection(album.id)
                                    }}
                                >
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                            </div>

                            <div className="aspect-[4/3] relative bg-blue-50 dark:bg-blue-900/20 overflow-hidden">
                                {/* Folder Decoration */}
                                <div className="absolute top-0 right-0 p-2 bg-blue-600/10 rounded-bl-lg z-10">
                                    <Folder className="w-4 h-4 text-blue-600" />
                                </div>

                                {album.cover ? (
                                    <Image
                                        src={album.cover}
                                        alt={album.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 bg-blue-50/50 dark:bg-blue-900/10">
                                        <Folder className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-xs font-medium text-blue-500">Album</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/gallery/${album.id}/edit`}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit Album
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => setDeletingId(album.id)}
                                            >
                                                <Trash className="w-4 h-4 mr-2" /> Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    <Link href={`/admin/gallery/${album.id}`}>{album.title}</Link>
                                </h3>
                                <div className="flex items-center text-xs text-muted-foreground gap-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(album.eventDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded-full">
                                        {album._count?.images || 0} Foto
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {/* --- STANDALONE IMAGES --- */}
                {images.map((img) => (
                    <Card key={`img-${img.id}`} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
                        <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
                            <Image
                                src={img.url}
                                alt={img.title || "Foto"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => setDeletingImageId(img.id)}
                                        >
                                            <Trash className="w-4 h-4 mr-2" /> Hapus Foto
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <p className="text-sm font-medium line-clamp-1 truncate">{img.title || "Tanpa Judul"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(img.createdAt).toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Album Alert */}
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

            {/* Bulk Delete Alert */}
            <AlertDialog open={showBulkDeleteAlert} onOpenChange={setShowBulkDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus {selectedAlbumIds.length} Album?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Album yang dipilih beserta isinya akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Hapus Semua
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Image Alert */}
            <AlertDialog open={!!deletingImageId} onOpenChange={() => setDeletingImageId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Foto ini akan dihapus permanen dari galeri.
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
        </>
    )
}
