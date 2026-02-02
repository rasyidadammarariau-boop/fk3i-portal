"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { MinimalEditor } from "./minimal-editor"
import { createNews, updateNews } from "@/app/admin/news/actions"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Save, X, Eye, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Category {
    id: string
    name: string
}

interface NewsFormProps {
    categories: Category[]
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
    }
}

const initialState = {
    error: '',
}

export function NewsForm({ categories, initialData }: NewsFormProps) {
    const isEdit = !!initialData
    const action = isEdit ? updateNews.bind(null, initialData.id) : createNews

    // Form States
    const [title, setTitle] = useState(initialData?.title || "")
    const [content, setContent] = useState(initialData?.content || "")
    const [tags, setTags] = useState<string[]>(initialData?.tags ? initialData.tags.split(',').filter(Boolean) : [])
    const [imagePreview, setImagePreview] = useState(initialData?.image || "")
    const [currentTag, setCurrentTag] = useState("")
    const [author, setAuthor] = useState(initialData?.author || "")
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || "")

    const [state, formAction, isPending] = useActionState(action, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form action={formAction}>
            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* --- LEFT COLUMN: INPUT FORM --- */}
                <div className="space-y-6">
                    <Card className="dark:border-gray-700 dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle>Editor Konten</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul berita..."
                                    required
                                    className="dark:bg-gray-900 text-lg font-bold"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        name="categoryId"
                                        required
                                        defaultValue={selectedCategoryId || undefined}
                                        onValueChange={setSelectedCategoryId}
                                    >
                                        <SelectTrigger className="dark:bg-gray-900">
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
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
                                        id="author"
                                        name="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Nama Penulis"
                                        className="dark:bg-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan Singkat</Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    defaultValue={initialData?.excerpt || ''}
                                    placeholder="Ringkasan singkat untuk list berita..."
                                    className="h-20 dark:bg-gray-900"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Gambar Utama</Label>
                                <input type="hidden" name="existingImage" value={initialData?.image || ''} />
                                <div className="border-2 border-dashed rounded-lg hover:bg-muted/50 transition cursor-pointer relative bg-gray-50 dark:bg-gray-900/50 border-input">
                                    <Input
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setImagePreview(URL.createObjectURL(file))
                                        }}
                                    />
                                    <div className="flex flex-col items-center justify-center py-4 text-center">
                                        <div className="p-3 bg-muted rounded-full mb-3">
                                            <Newspaper className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium text-sm">Klik untuk upload gambar</p>
                                        <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG, WebP (Max 2MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Isi Berita</Label>
                                <MinimalEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Mulai menulis..."
                                />
                                <input type="hidden" name="content" value={content} />
                            </div>

                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2 p-3 border border-input rounded-md min-h-[48px] bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all">
                                    {tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="px-2 py-1 gap-1 text-sm">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                                className="text-muted-foreground hover:text-red-500 rounded-full p-0.5 hover:bg-background/50"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    <input
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                e.preventDefault()
                                                if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                                                    setTags([...tags, currentTag.trim()])
                                                    setCurrentTag("")
                                                }
                                            } else if (e.key === 'Backspace' && !currentTag && tags.length > 0) {
                                                setTags(tags.slice(0, -1))
                                            }
                                        }}
                                        placeholder={tags.length === 0 ? "Ketik tag..." : ""}
                                        className="bg-transparent border-none outline-none focus:ring-0 flex-1 min-w-[120px] text-sm h-6 p-0 placeholder:text-muted-foreground"
                                    />
                                </div>
                                <input type="hidden" name="tags" value={tags.join(',')} />
                                <p className="text-xs text-muted-foreground">Tekan Enter atau Koma untuk membuat tag.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                                <Link href="/admin/news">
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
                                    {isPending ? "Proses..." : <><Save className="w-4 h-4 mr-2" /> {isEdit ? "Update" : "Terbitkan"}</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN: LIVE PREVIEW --- */}
                <div className="hidden lg:block sticky top-6 h-[calc(100vh-3rem)]">
                    <Card className="border shadow-sm overflow-hidden flex flex-col h-full bg-gray-100 dark:bg-black/20">
                        <CardHeader className="py-3 px-4 bg-white/50 dark:bg-gray-900/50 border-b shrink-0 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs font-mono uppercase tracking-wider">Homepage Simulation</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 overflow-y-auto relative">
                            <div className="min-h-full w-full p-8 flex justify-center items-start">
                                {/* Simulated Article Page Container */}
                                <div className="bg-white dark:bg-gray-950 rounded-xl shadow-xl border w-full max-w-[800px] overflow-hidden min-h-[800px] flex flex-col">

                                    {/* Cover Image Area */}
                                    <div className="w-full aspect-video bg-gray-100 dark:bg-gray-900 border-b relative group">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-30">
                                                <Newspaper className="w-16 h-16 mb-4" />
                                                <span className="text-sm font-medium">Cover Image Area</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 md:p-12 flex-1">
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                                            {tags.map((tag) => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-6 leading-tight">
                                            {title || <span className="opacity-20">Judul Berita...</span>}
                                        </h1>

                                        {/* Meta Data */}
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-10 border-b pb-10 uppercase tracking-widest font-mono text-xs">
                                            {selectedCategoryId && (
                                                <>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                                        {categories.find(c => c.id === selectedCategoryId)?.name || "Kategori"}
                                                    </span>
                                                    <span className="text-gray-300 mx-2">•</span>
                                                </>
                                            )}
                                            <span className="font-medium text-foreground">{author || "Author"}</span>
                                            <span className="text-gray-300 mx-2">•</span>
                                            <span>{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>

                                        {/* Article Content */}
                                        <div
                                            className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-serif leading-loose break-words"
                                            dangerouslySetInnerHTML={{
                                                __html: content || "<p class='text-center opacity-20 italic'>Konten berita akan muncul di sini...</p>"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
