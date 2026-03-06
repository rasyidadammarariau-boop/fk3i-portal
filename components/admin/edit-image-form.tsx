
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, UploadCloud } from "lucide-react"
import Link from "next/link"
import { updateGalleryImage } from "@/app/admin/gallery/actions"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

const initialState = {
    error: '',
    success: false
}

export default function EditImageForm({ image }: { image: { id: string, title?: string | null, url: string } }) {
    const updateImageWithId = updateGalleryImage.bind(null, image.id)
    const [state, formAction, isPending] = useActionState(updateImageWithId, initialState)
    const [imagePreview, setImagePreview] = useState(image.url || "")

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form action={formAction}>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/gallery">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Foto</h1>
                    <p className="">Ubah informasi atau status foto.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Foto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Foto</Label>
                                <Input id="title" name="title" defaultValue={image.title || ""} placeholder="Judul foto..." />
                            </div>

                            <div className="space-y-2">
                                <Label>File Foto (Opsional)</Label>
                                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer relative min-h-[200px]">
                                    <Input
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setImagePreview(URL.createObjectURL(file))
                                        }}
                                    />
                                    {imagePreview ? (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <div className="relative h-[200px] w-full">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="rounded shadow-sm object-contain"
                                                />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                                                <p className="text-white font-medium">Ganti Foto</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-muted rounded-full mb-3">
                                                <UploadCloud className="w-8 h-8 " />
                                            </div>
                                            <p className="text-sm font-medium">Klik untuk ganti foto</p>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs ">Biarkan kosong jika tidak ingin mengubah foto.</p>
                            </div>

                            <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
                                <Link href="/admin/gallery">
                                    <Button variant="ghost" type="button" className="w-full sm:w-auto">Batal</Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    name="status"
                                    value="draft"
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
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                                    ) : (
                                        <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}

