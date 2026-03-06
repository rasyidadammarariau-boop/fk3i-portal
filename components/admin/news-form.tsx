"use client"

import { useActionState, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { MinimalEditor } from "./minimal-editor"
import { createNews, updateNews } from "@/app/admin/news/actions"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Save, X, Eye, Newspaper, Clock, Star, Tag as TagIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/admin/image-upload"
import { GalleryPicker } from "@/components/admin/gallery-picker"
import { Paperclip, FileText, Trash2 } from "lucide-react"

interface Category {
    id: string
    name: string
}

interface NewsFormProps {
    categories: Category[]
    currentUserName?: string
    initialData?: {
        id: string
        title: string
        content: string
        image?: string | null
        categoryId?: string | null
        excerpt?: string | null
        author?: string | null
        tags?: string | null
        published?: boolean
        featured?: boolean
        publishedAt?: Date | string | null
        metaTitle?: string | null
        metaDescription?: string | null
        attachmentUrl?: string | null
        attachmentName?: string | null
    }
}

/** Hitung estimasi waktu baca dari konten HTML */
function calcReadTime(content: string): number {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = plainText.split(' ').filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / 200))
}

const initialState = { error: '' }

export function NewsForm({ categories, currentUserName, initialData }: NewsFormProps) {
    const isEdit = !!initialData
    const action = isEdit ? updateNews.bind(null, initialData.id) : createNews

    // Content states
    const [title, setTitle] = useState(initialData?.title || "")
    const [content, setContent] = useState(initialData?.content || "")
    const [tags, setTags] = useState<string[]>(
        initialData?.tags ? initialData.tags.split(',').filter(Boolean) : []
    )
    const [currentTag, setCurrentTag] = useState("")
    const [author, setAuthor] = useState(initialData?.author || currentUserName || "")
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || "")

    // Image Upload vs URL Mode
    const [imageMode, setImageMode] = useState<"upload" | "url" | "gallery">("upload")
    const [imageUrl, setImageUrl] = useState(initialData?.image || "")
    const [uploadPreview, setUploadPreview] = useState(initialData?.image || "")

    // Live preview bergantung pada tab yang aktif
    const activePreview = imageMode === "upload" ? uploadPreview : imageUrl

    // Publishing states
    const [featured, setFeatured] = useState(initialData?.featured ?? false)
    const [publishedAt, setPublishedAt] = useState(
        initialData?.publishedAt
            ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
            : ""
    )

    // Attachment
    const [attachmentName, setAttachmentName] = useState(initialData?.attachmentName || "")
    const [existingAttachmentUrl] = useState(initialData?.attachmentUrl || "")
    const [removeAttachment, setRemoveAttachment] = useState(false)

    // SEO states
    const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "")
    const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")

    // Read time (live)
    const [readTime, setReadTime] = useState(calcReadTime(initialData?.content || ""))

    const updateReadTime = useCallback((html: string) => {
        setReadTime(calcReadTime(html))
        setContent(html)
    }, [])

    const [state, formAction, isPending] = useActionState(action, initialState)

    useEffect(() => {
        if (state?.error) toast.error(state.error)
    }, [state])

    // Auto-fill metaTitle dari judul
    useEffect(() => {
        if (!metaTitle && title) setMetaTitle(title)
    }, [title, metaTitle])

    return (
        <form action={formAction}>
            {isEdit && <input type="hidden" name="existingImage" value={initialData?.image || ""} />}
            <input type="hidden" name="imageMode" value={imageMode} />
            {isEdit && <input type="hidden" name="existingAttachmentUrl" value={existingAttachmentUrl} />}
            {isEdit && <input type="hidden" name="existingAttachmentName" value={initialData?.attachmentName || ""} />}
            <input type="hidden" name="removeAttachment" value={removeAttachment ? "true" : "false"} />

            <div className="grid xl:grid-cols-[1fr_360px] gap-8 items-start">

                {/* ─── LEFT: EDITOR ─── */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Newspaper className="w-5 h-5" />
                                Editor Konten
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Judul */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title" name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul berita..."
                                    required
                                    className="text-lg font-bold"
                                />
                            </div>

                            {/* Kategori + Penulis */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Kategori <span className="text-destructive">*</span></Label>
                                    <Select name="categoryId" required defaultValue={selectedCategoryId || undefined} onValueChange={setSelectedCategoryId}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Penulis</Label>
                                    <Input
                                        id="author" name="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Nama Penulis"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan Singkat</Label>
                                <Textarea
                                    id="excerpt" name="excerpt"
                                    defaultValue={initialData?.excerpt || ''}
                                    placeholder="Ringkasan singkat untuk list berita (max 200 karakter)..."
                                    className="h-20 resize-none"
                                    maxLength={200}
                                />
                            </div>

                            {/* Gambar Utama */}
                            <div className="space-y-4">
                                <Label>Gambar Utama Berita</Label>
                                <Tabs value={imageMode} onValueChange={(val: string) => setImageMode(val as "upload" | "url" | "gallery")} className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-4">
                                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                                        <TabsTrigger value="url">Link Eksternal</TabsTrigger>
                                        <TabsTrigger value="gallery">Pilih dari Galeri</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="upload" className="space-y-4">
                                        <ImageUpload
                                            name="image"
                                            defaultValue={imageMode === 'upload' ? initialData?.image : undefined}
                                            label="Pilih Foto dari Perangkat"
                                            onPreviewChange={setUploadPreview}
                                        />
                                        <p className="text-xs text-muted-foreground">Gambar akan dikonversi otomatis ke WebP.</p>
                                    </TabsContent>

                                    <TabsContent value="url" className="space-y-4">
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                name="imageUrlUrl"
                                                placeholder="https://... atau /uploads/gallery/..."
                                                value={imageMode === "url" ? imageUrl : ""}
                                                onChange={(e) => {
                                                    setImageUrl(e.target.value)
                                                }}
                                            />
                                            {imageMode === "url" && imageUrl && (
                                                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-muted">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground">Paste URL gambar dari sumber eksternal.</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="gallery" className="space-y-4">
                                        <GalleryPicker
                                            selectedUrl={imageUrl}
                                            onSelect={(url) => {
                                                setImageUrl(url)
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground">Pilih gambar yang sudah terunggah di Galeri Sistem.</p>
                                    </TabsContent>

                                    {/* Hidden Input penampung URL jika modenya link/galeri */}
                                    <input type="hidden" name="imageUrl" value={imageMode !== "upload" ? imageUrl : ""} />
                                </Tabs>
                            </div>

                            {/* Isi Berita */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Isi Berita <span className="text-destructive">*</span></Label>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{readTime} menit baca</span>
                                    </div>
                                </div>
                                <MinimalEditor
                                    value={content}
                                    onChange={updateReadTime}
                                    placeholder="Mulai menulis..."
                                />
                                <input type="hidden" name="content" value={content} />
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5">
                                    <TagIcon className="w-4 h-4" /> Tags
                                </Label>
                                <div className="flex flex-wrap gap-2 mb-2 p-3 border rounded-md min-h-[48px] bg-background focus-within:ring-2 focus-within:ring-ring transition-all">
                                    {tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                                className="hover:text-destructive rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    <Input
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                e.preventDefault()
                                                const trimmed = currentTag.trim()
                                                if (trimmed && !tags.includes(trimmed)) {
                                                    setTags([...tags, trimmed])
                                                    setCurrentTag("")
                                                }
                                            } else if (e.key === 'Backspace' && !currentTag && tags.length > 0) {
                                                setTags(tags.slice(0, -1))
                                            }
                                        }}
                                        placeholder={tags.length === 0 ? "Ketik tag, tekan Enter..." : ""}
                                        className="bg-transparent border-none shadow-none focus-visible:ring-0 flex-1 min-w-[120px] text-sm p-0"
                                    />
                                </div>
                                <input type="hidden" name="tags" value={tags.join(',')} />
                                <p className="text-xs text-muted-foreground">Tekan Enter atau koma untuk membuat tag.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                SEO & Meta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <span className="text-xs text-muted-foreground">{metaTitle.length}/60</span>
                                </div>
                                <Input
                                    id="metaTitle" name="metaTitle"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    placeholder="Judul untuk mesin pencari (default: judul artikel)"
                                    maxLength={60}
                                />
                                <div className="text-xs">
                                    {metaTitle.length < 40 && <span className="text-amber-500">⚠ Terlalu pendek (ideal 40-60 karakter)</span>}
                                    {metaTitle.length >= 40 && metaTitle.length <= 60 && <span className="text-green-600">✓ Panjang ideal</span>}
                                    {metaTitle.length > 60 && <span className="text-destructive">✗ Terlalu panjang</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <span className="text-xs text-muted-foreground">{metaDescription.length}/155</span>
                                </div>
                                <Textarea
                                    id="metaDescription" name="metaDescription"
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder="Deskripsi singkat untuk mesin pencari dan preview link..."
                                    className="h-20 resize-none"
                                    maxLength={155}
                                />
                                <div className="text-xs">
                                    {metaDescription.length < 100 && <span className="text-amber-500">⚠ Terlalu pendek (ideal 100-155 karakter)</span>}
                                    {metaDescription.length >= 100 && <span className="text-green-600">✓ Panjang ideal</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Link href="/admin/news">
                            <Button variant="ghost" type="button" className="w-full sm:w-auto">Batal</Button>
                        </Link>
                        <Button type="submit" name="status" value="draft" variant="secondary" disabled={isPending} className="w-full sm:w-auto">
                            Simpan Draft
                        </Button>
                        <Button type="submit" name="status" value="published" disabled={isPending} className="w-full sm:w-auto">
                            {isPending ? "Proses..." : <><Save className="w-4 h-4 mr-2" />{isEdit ? "Update" : "Terbitkan"}</>}
                        </Button>
                    </div>
                </div>

                {/* ─── RIGHT: SETTINGS + PREVIEW ─── */}
                <div className="space-y-4">
                    {/* Penerbitan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Penerbitan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Featured Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-amber-500" />
                                        Berita Unggulan
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Tampil sebagai headline di homepage</p>
                                </div>
                                <Switch
                                    checked={featured}
                                    onCheckedChange={setFeatured}
                                    name="featured"
                                    value="on"
                                />
                            </div>
                            <input type="hidden" name="featured" value={featured ? "on" : "off"} />

                            <Separator />

                            {/* Jadwal Terbit */}
                            <div className="space-y-2">
                                <Label htmlFor="publishedAt">Jadwal Terbit</Label>
                                <Input
                                    id="publishedAt" name="publishedAt"
                                    type="datetime-local"
                                    value={publishedAt}
                                    onChange={(e) => setPublishedAt(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Kosongkan untuk menggunakan tanggal sekarang</p>
                            </div>

                            {/* Attachment / Lampiran PDF */}
                            <Separator />
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-semibold">
                                    <Paperclip className="w-4 h-4" /> Lampiran Dokumen
                                </Label>
                                <p className="text-xs text-muted-foreground">Unggah file PDF Press Release atau Kajian untuk didownload publik.</p>

                                {existingAttachmentUrl && !removeAttachment && (
                                    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="text-sm truncate font-medium">{attachmentName || "Dokumen.pdf"}</span>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setRemoveAttachment(true)} className="text-destructive h-8 px-2">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                {(!existingAttachmentUrl || removeAttachment) && (
                                    <div className="space-y-2">
                                        <Input
                                            id="attachment" name="attachment"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) setAttachmentName(file.name)
                                                setRemoveAttachment(false)
                                            }}
                                            className="text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                        <Input
                                            name="attachmentName"
                                            placeholder="Nama file yang tampil (misal: Rilis Sikap BEM)"
                                            value={attachmentName}
                                            onChange={(e) => setAttachmentName(e.target.value)}
                                            className="text-sm mt-2"
                                        />
                                        {removeAttachment && existingAttachmentUrl && (
                                            <Button type="button" variant="link" size="sm" onClick={() => setRemoveAttachment(false)} className="text-xs px-0">
                                                Batalkan penghapusan file lama
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* ReadTime Info */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span>Estimasi waktu baca: <strong className="text-foreground">{readTime} menit</strong></span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Live Preview */}
                    <Card className="overflow-hidden">
                        <CardHeader className="py-3 px-4 bg-muted/30 border-b">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                <Eye className="w-3.5 h-3.5" />
                                Preview Artikel
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 overflow-y-auto max-h-[500px]">
                                {/* Cover */}
                                <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden mb-4 border">
                                    {activePreview ? (
                                        <img src={activePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <Newspaper className="w-8 h-8 opacity-30" />
                                        </div>
                                    )}
                                </div>

                                {featured && <Badge className="mb-2 bg-amber-500 text-white text-xs">Unggulan</Badge>}

                                {/* Title */}
                                <h2 className="font-serif font-bold text-lg leading-tight mb-2">
                                    {title || <span className="text-muted-foreground/40">Judul Berita...</span>}
                                </h2>

                                {/* Tags */}
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Meta */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <span>{author || "Penulis"}</span>
                                    <span>•</span>
                                    <Clock className="w-3 h-3" />
                                    <span>{readTime} mnt</span>
                                    <span>•</span>
                                    <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>

                                <Separator className="mb-3" />

                                {/* Content preview */}
                                <div
                                    className="prose prose-sm max-w-none text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: content || "<p class='text-muted-foreground/40 italic'>Konten akan muncul di sini...</p>"
                                    }}
                                />

                                {/* Attachment Preview */}
                                {(!removeAttachment && (existingAttachmentUrl || attachmentName)) && (
                                    <div className="mt-4 p-3 border rounded-lg bg-primary/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded shrink-0 text-primary">
                                                <Paperclip className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold">Lampiran Tersedia</p>
                                                <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{attachmentName || "Dokumen.pdf"}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-7 text-[10px]" disabled>
                                            Download
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
