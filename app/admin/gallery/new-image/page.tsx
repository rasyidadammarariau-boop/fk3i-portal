"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, UploadCloud } from "lucide-react"
import Link from "next/link"
import { uploadGalleryImage } from "../actions"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

const initialState = {
    error: '',
    success: false
}

import { Loader2, Save } from "lucide-react"

export default function UploadImagePage() {
    const [state, formAction, isPending] = useActionState(uploadGalleryImage, initialState)
    const [imagePreview, setImagePreview] = useState("")
    const [status, setStatus] = useState<'draft' | 'published'>('published')

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/gallery">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Upload Foto</h1>
                    <p className="">Upload foto lepas tanpa album.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Foto (Opsional)</Label>
                            <Input id="title" name="title" placeholder="Berikan judul foto..." />
                        </div>

                        <div className="space-y-4">
                            <Label>File Foto</Label>
                            <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer relative min-h-[300px]">
                                <Input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    required
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) setImagePreview(URL.createObjectURL(file))
                                    }}
                                />
                                {imagePreview ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={imagePreview} className="max-h-[250px] rounded shadow-lg object-contain" alt="Preview" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                                            <p className="text-white font-medium">Ganti Foto</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 bg-muted rounded-full mb-4">
                                            <UploadCloud className="w-10 h-10 " />
                                        </div>
                                        <p className="text-lg font-medium">Drag & drop atau klik untuk upload</p>
                                        <p className="text-sm  mt-2">Mendukung JPG, PNG, WebP (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
                            <input type="hidden" name="status" value={status} />
                            <Link href="/admin/gallery">
                                <Button variant="ghost" type="button" className="w-full sm:w-auto">Batal</Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="secondary"
                                onClick={() => setStatus('draft')}
                                disabled={isPending || !imagePreview}
                                className="w-full sm:w-auto"
                            >
                                Simpan Draft
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => setStatus('published')}
                                disabled={isPending || !imagePreview}
                                className="w-full sm:w-auto"
                            >
                                {isPending ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengupload...</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-2" /> Upload & Terbitkan</>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

