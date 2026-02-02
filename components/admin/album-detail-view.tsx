"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Image as ImageIcon, Trash2, UploadCloud, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useRef } from "react"
import { uploadAlbumPhotos, deleteGalleryImage } from "@/app/admin/gallery/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AlbumDetailViewProps {
    album: any
}

export function AlbumDetailView({ album }: AlbumDetailViewProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await handleUpload(e.dataTransfer.files)
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files.length > 0) {
            await handleUpload(e.target.files)
        }
    }

    const handleUpload = async (fileList: FileList | File[]) => {
        setIsUploading(true)
        const formData = new FormData()

        // Convert FileList to array if needed
        const files = fileList instanceof FileList ? Array.from(fileList) : fileList

        files.forEach(file => {
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
        } catch (error) {
            toast.error("Terjadi kesalahan saat upload")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDeletePhoto = async (photoId: string) => {
        if (!confirm("Hapus foto ini?")) return

        try {
            await deleteGalleryImage(photoId)
            toast.success("Foto dihapus")
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus foto")
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/admin/gallery" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Galeri
                </Link>

                <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{album.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(album.eventDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                            </span>
                            <span>•</span>
                            <span>{album.images.length} Foto</span>
                        </div>
                        {album.description && (
                            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl">{album.description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Zone */}
            <Card
                className={`border-2 border-dashed transition-colors ${dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                    />

                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <UploadCloud className="w-8 h-8 text-primary" />
                    </div>

                    <h3 className="text-lg font-medium mb-1">Upload Foto ke Album Ini</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                        Drag & drop foto di sini, atau klik tombol di bawah untuk memilih banyak foto sekaligus.
                    </p>

                    <Button
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isUploading ? "Mengupload..." : (
                            <>
                                <Plus className="w-4 h-4 mr-2" /> Pilih Foto
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {album.images.map((img: any) => (
                    <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                        <Image
                            src={img.url}
                            alt={img.title || "Foto Album"}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeletePhoto(img.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {album.images.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg">
                    Belum ada foto di album ini.
                </div>
            )}
        </div>
    )
}
