"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarIcon, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { createAlbum } from "../actions"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
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
                    <p className="text-muted-foreground">Kumpulkan foto kegiatan dalam satu album.</p>
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
                                    <Input id="title" name="title" placeholder="Contoh: Kegiatan Bakti Sosial 2024" required />
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
                                                    !date && "text-muted-foreground"
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

                                <div className="space-y-4">
                                    <Label>Cover Album (Opsional)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer relative">
                                        <Input
                                            name="cover"
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) setImagePreview(URL.createObjectURL(file))
                                            }}
                                        />
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} className="max-h-48 rounded shadow-sm object-contain" alt="Preview" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded text-white text-sm font-medium">
                                                    Ganti Cover
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-muted rounded-full mb-3">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium">Klik untuk upload cover</p>
                                                <p className="text-xs text-muted-foreground">JPG, PNG, WebP (Max 2MB)</p>
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
                                <p className="col-span-2 text-sm text-muted-foreground p-4">
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
