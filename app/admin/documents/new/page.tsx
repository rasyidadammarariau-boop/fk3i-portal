"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { createDocument } from "../actions"
import { DOC_CATEGORIES } from "../constants"

const initialState = { error: '' }

export default function NewDocumentPage() {
    const [state, formAction, isPending] = useActionState(createDocument, initialState)
    const [category, setCategory] = useState('umum')
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/documents">
                    <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Unggah Dokumen Baru</h1>
                    <p className="text-muted-foreground text-sm">Tambahkan dokumen organisasi ke repositori.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Informasi Dokumen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-5">
                        <input type="hidden" name="category" value={category} />

                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Dokumen *</Label>
                            <Input id="title" name="title" placeholder="e.g. AD/ART BEM Pesantren Indonesia 2024" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(DOC_CATEGORIES).map(([val, label]) => (
                                        <SelectItem key={val} value={val}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi (Opsional)</Label>
                            <Textarea id="description" name="description" placeholder="Jelaskan isi dokumen ini secara singkat..." rows={3} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file">File Dokumen *</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center relative hover:bg-muted/30 transition-colors">
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                                    required
                                />
                                {fileName ? (
                                    <div className="flex items-center justify-center gap-2 text-primary font-medium">
                                        <FileText className="w-5 h-5" />
                                        {fileName}
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm font-medium">Klik untuk pilih file</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, PowerPoint</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2 border-t">
                            <Link href="/admin/documents" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">Batal</Button>
                            </Link>
                            <Button type="submit" name="status" value="draft" variant="secondary" disabled={isPending} className="flex-1">
                                Simpan Draft
                            </Button>
                            <Button type="submit" name="status" value="published" disabled={isPending} className="flex-1">
                                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengunggah...</> : 'Unggah & Publikasikan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
