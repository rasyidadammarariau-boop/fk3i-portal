"use client"

import { useEffect, useState } from "react"
import { getAvailableImagesForPicker } from "@/app/admin/gallery/actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Loader2, Check } from "lucide-react"
import Image from "next/image"

interface GalleryPickerProps {
    onSelect: (url: string) => void
    selectedUrl?: string
}

type GalleryItem = { id: string; url: string; title: string | null }

export function GalleryPicker({ onSelect, selectedUrl }: GalleryPickerProps) {
    const [images, setImages] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchImages() {
            try {
                const data = await getAvailableImagesForPicker()
                setImages(data || [])
            } catch (err) {
                console.error("Failed to load gallery images", err)
            } finally {
                setLoading(false)
            }
        }
        fetchImages()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border rounded-lg h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Memuat gambar dari galeri...</p>
            </div>
        )
    }

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border rounded-lg h-64 text-center">
                <p className="text-sm text-muted-foreground">Belum ada gambar di galeri sistem.</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-72 w-full rounded-md border bg-muted/10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                {images.map(img => {
                    const isSelected = img.url === selectedUrl
                    return (
                        <Card
                            key={img.id}
                            className={`group cursor-pointer relative aspect-square overflow-hidden border-2 transition-all hover:border-primary/50 ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                            onClick={() => onSelect(img.url)}
                        >
                            <Image
                                src={img.url}
                                alt={img.title || "Gallery image"}
                                fill
                                className={`object-cover transition-transform duration-300 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                            />
                            {isSelected && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-white truncate drop-shadow-md">
                                    {img.title || "Tanpa Judul"}
                                </p>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
