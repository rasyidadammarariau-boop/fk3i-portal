"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarIcon, ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { createAlbum } from "../actions"
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
import { id } from "date-fns/locale"

const initialState = {
    error: '',
    success: false
}

export default function CreateAlbumPage() {
    const [state, formAction, isPending] = useActionState(createAlbum, initialState)
    const [status, setStatus] = useState<'draft' | 'published'>('published')
    const [date, setDate] = useState<Date>(new Date())
    const [imagePreview, setImagePreview] = useState("")
    const [activityType, setActivityType] = useState('kegiatan')

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/gallery">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Buat Album Baru</h1>
                    <p className="">Kumpulkan foto kegiatan dalam satu album.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Album</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={formAction} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Nama Album / Kegiatan</Label>
                                    <Input id="title" name="title" placeholder="Contoh: Aksi Tolak RUU di DPR 2025" required />
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
                                    <Input id="location" name="location" placeholder="Jakarta, Gedung DPR, Kementerian..." />
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
                                                {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
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
                                    <Textarea id="description" name="description" placeholder="Deskripsikan kegiatan ini..." />
                                </div>

                                <div className="space-y-2">
                                    <Label>Cover Album (Opsional)</Label>
                                    <ImageUpload
                                        name="cover"
                                        label="Cover Album"
                                        onPreviewChange={setImagePreview}
                                    />
                                    <p className="text-xs text-muted-foreground">Gambar otomatis dikonversi ke WebP.</p>
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
                                        disabled={isPending}
                                        className="w-full sm:w-auto"
                                    >
                                        Simpan Draft
                                    </Button>
                                    <Button
                                        type="submit"
                                        onClick={() => setStatus('published')}
                                        disabled={isPending}
                                        className="w-full sm:w-auto"
                                    >
                                        {isPending ? "Menyimpan..." : "Simpan & Terbitkan"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Placeholder */}
                <div className="lg:col-span-1 space-y-4 opacity-70 cursor-not-allowed grayscale">
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-lg">Foto Album</CardTitle>
                            <CardDescription>Simpan album untuk menambah foto.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3 h-[200px] items-center justify-center text-center bg-muted/30 rounded-lg border-2 border-dashed">
                                <p className="col-span-2 text-sm  p-4">
                                    Area ini akan aktif setelah album dibuat.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}

