"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ArrowLeft, CheckCircle2, Circle, MapPin } from "lucide-react"
import Link from "next/link"
import { updateGalleryAlbum } from "@/app/admin/gallery/actions"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
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

const initialState = {
    error: '',
    success: false
}

import { Trash2, Plus, Loader2, Save } from "lucide-react"
import { deleteGalleryImage, deleteGalleryImages, uploadAlbumPhotos } from "@/app/admin/gallery/actions"
import Image from "next/image"

export default function EditAlbumForm({ album }: { album: { id: string, title: string, eventDate: Date, description: string | null, cover: string | null, activityType: string, location: string | null, images: Array<{ id: string, url: string }> } }) {
    const updateAlbumWithId = updateGalleryAlbum.bind(null, album.id)
    const [state, formAction, isPending] = useActionState(updateAlbumWithId, initialState)
    const [date, setDate] = useState<Date>(new Date(album.eventDate))
    const [_imagePreview, _setImagePreview] = useState(album.cover || "")
    const [isUploading, setIsUploading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [photoToDelete, setPhotoToDelete] = useState<string | null>(null)
    const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false)
    const [activityType, setActivityType] = useState(album.activityType || 'kegiatan')

    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    const handleDeletePhoto = async () => {
        if (!photoToDelete) return

        try {
            await deleteGalleryImage(photoToDelete)
            toast.success("Foto dihapus")
            setPhotoToDelete(null)
            router.refresh()
        } catch {
            toast.error("Gagal menghapus foto")
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return

        try {
            await deleteGalleryImages(selectedIds)
            toast.success(`${selectedIds.length} foto dihapus`)
            setSelectedIds([])
            setShowBulkDeleteAlert(false)
            router.refresh()
        } catch {
            toast.error("Gagal menghapus foto terpilih")
        }
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === album.images.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(album.images.map((img: { id: string }) => img.id))
        }
    }

    const handleSidebarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setIsUploading(true)
        const formData = new FormData()
        Array.from(e.target.files).forEach(file => {
            formData.append('images', file)
        })

        try {
            const result = await uploadAlbumPhotos(album.id, formData)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        } catch {
            toast.error("Gagal mengupload foto")
        } finally {
            setIsUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/gallery">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Album</h1>
                    <p className="">Ubah informasi detail album ini.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Edit Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Album</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={formAction} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Nama Album / Kegiatan</Label>
                                    <Input id="title" name="title" defaultValue={album.title} required />
                                </div>

                                {/* Jenis Kegiatan */}
                                <div className="space-y-2">
                                    <Label>Jenis Kegiatan</Label>
                                    <input type="hidden" name="activityType" value={activityType} />
                                    <Select value={activityType} onValueChange={setActivityType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kegiatan..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aksi"> Aksi / Demonstrasi</SelectItem>
                                            <SelectItem value="audiensi"> Audiensi / Advokasi</SelectItem>
                                            <SelectItem value="silatnas"> Silatnas / Konsolidasi</SelectItem>
                                            <SelectItem value="kajian"> Kajian / Diskusi Publik</SelectItem>
                                            <SelectItem value="pengabdian"> Pengabdian Masyarakat</SelectItem>
                                            <SelectItem value="kegiatan"> Kegiatan Umum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Lokasi */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" /> Lokasi
                                    </Label>
                                    <Input id="location" name="location" defaultValue={album.location || ''} placeholder="Kota, Gedung, atau Instansi Tujuan" />
                                </div>

                                <div className="space-y-2 flex flex-col">
                                    <Label>Tanggal Kegiatan</Label>
                                    <input type="hidden" name="eventDate" value={date.toISOString()} />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && ""
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP", { locale: idLocale }) : <span>Pilih tanggal</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(d) => d && setDate(d)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi Singkat</Label>
                                    <Textarea id="description" name="description" defaultValue={album.description || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Cover Album</Label>
                                    <ImageUpload
                                        name="cover"
                                        defaultValue={album.cover}
                                        label="Cover Album"
                                    />
                                </div>

                                <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
                                    <Link href="/admin/gallery">
                                        <Button variant="ghost" type="button" className="w-full sm:w-auto">Batal</Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        name="status"
                                        value="draft"
                                        variant="secondary"
                                        disabled={isPending}
                                        className="w-full sm:w-auto"
                                    >
                                        Simpan Draft
                                    </Button>
                                    <Button
                                        type="submit"
                                        name="status"
                                        value="published"
                                        disabled={isPending}
                                        className="w-full sm:w-auto"
                                    >
                                        {isPending ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Proses...</>
                                        ) : (
                                            <><Save className="w-4 h-4 mr-2" /> Update & Terbitkan</>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Photo List */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle className="text-lg">Foto Album</CardTitle>
                                <div className="flex gap-2">
                                    {selectedIds.length > 0 && (
                                        <Button size="sm" variant="destructive" onClick={() => setShowBulkDeleteAlert(true)}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Hapus ({selectedIds.length})
                                        </Button>
                                    )}
                                    <input
                                        id="sidebar-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleSidebarUpload}
                                    />
                                    <Button size="sm" variant="outline" onClick={() => document.getElementById('sidebar-upload')?.click()} disabled={isUploading}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            {album.images && album.images.length > 0 && (
                                <div className="flex items-center gap-2 text-sm ">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-0 h-auto font-normal hover:bg-transparent hover:text-primary"
                                        onClick={toggleSelectAll}
                                    >
                                        {selectedIds.length === album.images.length ? "Batal Pilih Semua" : "Pilih Semua"}
                                    </Button>
                                    <span>•</span>
                                    <span>{album.images.length} Foto</span>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                                {album.images && album.images.length > 0 ? (
                                    album.images.map((img: { id: string, url: string }) => {
                                        const isSelected = selectedIds.includes(img.id)
                                        return (
                                            <div
                                                key={img.id}
                                                className={cn(
                                                    "group relative aspect-square bg-gray-100 rounded-md overflow-hidden border cursor-pointer transition-all",
                                                    isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                                                )}
                                                onClick={() => toggleSelection(img.id)}
                                            >
                                                <Image
                                                    src={img.url}
                                                    alt="Foto"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className={cn(
                                                    "absolute top-2 right-2 transition-all",
                                                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                )}>
                                                    {isSelected ? (
                                                        <CheckCircle2 className="w-5 h-5 text-primary fill-white" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-white drop-shadow-md" />
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 z-10"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPhotoToDelete(img.id)
                                                        }}
                                                        type="button"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="col-span-2 text-center text-sm  py-8">
                                        Belum ada foto.
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <Link href={`/admin/gallery/${album.id}`}>
                                    <Button variant="outline" className="w-full text-sm">
                                        Kelola Gallery Detail
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Alert Dialog for Single Delete */}
            <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Foto akan dihapus permanen dari album.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePhoto} className="bg-destructive hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert Dialog for Bulk Delete */}
            <AlertDialog open={showBulkDeleteAlert} onOpenChange={setShowBulkDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus {selectedIds.length} foto terpilih?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. {selectedIds.length} foto yang dipilih akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">
                            Hapus Semua
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

