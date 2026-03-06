"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useActionState, useState } from "react"
import { toast } from "sonner"
import { useEffect } from "react"
import { ImageUpload } from "@/components/admin/image-upload"

interface ActionState {
    error?: string
    success?: boolean
}

interface AgendaFormProps {
    action: (prevState: unknown, formData: FormData) => Promise<unknown>
    initialData?: {
        title: string
        description: string
        date: string // ISO string
        location: string
        image?: string | null
        published?: boolean
    }
}

export function AgendaForm({ action, initialData }: AgendaFormProps) {
    const [state, formAction, isPending] = useActionState(action, null)

    // Controlled states for preview
    const [title, setTitle] = useState(initialData?.title || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : "")
    const [location, setLocation] = useState(initialData?.location || "")
    const [imagePreview] = useState(initialData?.image || "")

    const isEdit = !!initialData

    useEffect(() => {
        const s = state as ActionState | null
        if (s?.error) {
            toast.error(s.error)
        }
    }, [state])

    return (
        <form action={formAction}>
            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* LEFT: FORM INPUTS */}
                <div className="space-y-6">
                    <div className=" p-6 rounded-xl border shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Nama Kegiatan</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Contoh: Rapat Kerja Nasional"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Tanggal & Waktu</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="datetime-local"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Lokasi</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="Contoh: Aula Utama"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Jelaskan detail kegiatan..."
                                    className="min-h-[150px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Poster / Gambar Kegiatan</Label>
                            <ImageUpload
                                name="image"
                                defaultValue={initialData?.image}
                                label="Poster Kegiatan"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                            <Link href="/admin/agenda">
                                <Button variant="ghost" type="button" className="w-full sm:w-auto">Batal</Button>
                            </Link>
                            <Button
                                type="submit" name="status" value="draft" variant="secondary" disabled={isPending}
                                className="w-full sm:w-auto"
                            >
                                Simpan Draft
                            </Button>
                            <Button
                                type="submit" name="status" value="published" disabled={isPending}
                                className="w-full sm:w-auto"
                            >
                                {isPending ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Proses...</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-2" /> {isEdit ? "Update & Terbitkan" : "Terbitkan"}</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: LIVE PREVIEW */}
                <div className="hidden lg:block sticky top-6">
                    <div className="/50 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <h3 className="text-sm font-semibold  mb-4 uppercase tracking-wider flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Live Preview
                        </h3>

                        {/* CARD PREVIEW */}
                        <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg border max-w-sm mx-auto">
                            <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-900 relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-sm">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-md text-center shadow-sm min-w-[60px]">
                                    <span className="block text-xs font-bold text-red-600 uppercase">
                                        {date ? new Date(date).toLocaleString('default', { month: 'short' }) : 'BLN'}
                                    </span>
                                    <span className="block text-xl font-bold leading-none">
                                        {date ? new Date(date).getDate() : '00'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h4 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                                        {title || "Judul Kegiatan..."}
                                    </h4>
                                    <div className="flex items-center text-sm ">
                                        <span className="w-4 h-4 mr-2 flex items-center justify-center">📍</span>
                                        <span className="line-clamp-1">{location || "Lokasi kegiatan..."}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                    {description || "Deskripsi singkat kegiatan akan muncul di sini..."}
                                </div>
                                <div className="pt-2">
                                    <Button size="sm" variant="outline" className="w-full rounded-full group">
                                        Lihat Detail
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs  mt-6">
                            Preview tampilan kartu agenda di halaman publik.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}

