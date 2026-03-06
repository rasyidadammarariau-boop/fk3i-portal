"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    name: string
    defaultValue?: string | null
    label?: string
    accept?: string
    className?: string
    onPreviewChange?: (url: string) => void
}

export function ImageUpload({
    name,
    defaultValue,
    label = "Gambar",
    accept = "image/*",
    className,
    onPreviewChange,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(defaultValue || "")
    const [uploading, setUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState<string>(defaultValue || "")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        onPreviewChange?.(objectUrl)
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Upload gagal")
            }

            setUploadedUrl(data.url)
            toast.success("Gambar berhasil diupload")
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Gagal mengupload gambar")
            setPreview(defaultValue || "")
            onPreviewChange?.(defaultValue || "")
            setUploadedUrl(defaultValue || "")
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview("")
        onPreviewChange?.("")
        setUploadedUrl("")
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className={cn("space-y-2", className)}>
            {/* Hidden input to submit the uploaded URL */}
            <input type="hidden" name={name} value={uploadedUrl} />

            {preview ? (
                <div className="relative group rounded-lg overflow-hidden border border-input">
                    <div className="relative w-full aspect-video">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Mengupload...
                            </div>
                        </div>
                    )}
                    {!uploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center gap-2  p-4 text-center">
                        <div className="p-3 bg-muted rounded-full">
                            <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium">Klik untuk upload {label}</p>
                        <p className="text-xs">JPG, PNG, WebP (maks. 2MB)</p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}
        </div>
    )
}

