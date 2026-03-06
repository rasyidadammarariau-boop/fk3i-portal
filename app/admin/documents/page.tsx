import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Download, Eye, EyeOff, Trash2 } from "lucide-react"
import { deleteDocument, toggleDocumentPublish } from "./actions"
import { DOC_CATEGORIES } from "./constants"
import { revalidatePath } from "next/cache"

const CATEGORY_COLORS: Record<string, string> = {
    'ad-art': 'destructive',
    'gbho': 'default',
    'sk': 'secondary',
    'sop': 'outline',
    'surat': 'secondary',
    'umum': 'outline',
}

async function getDocuments() {
    try {
        return await prisma.orgDocument.findMany({
            orderBy: { createdAt: 'desc' },
        })
    } catch { return [] }
}

export default async function AdminDocumentsPage() {
    const documents = await getDocuments()
    const totalDownloads = documents.reduce((s, d) => s + d.downloadCount, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Repositori Dokumen</h1>
                    <p className="text-muted-foreground mt-1">Kelola AD/ART, GBHO, SK, SOP, dan dokumen resmi organisasi.</p>
                </div>
                <Link href="/admin/documents/new">
                    <Button className="gap-2 shadow-lg">
                        <Plus className="w-4 h-4" /> Unggah Dokumen
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Dokumen</p>
                        <p className="text-2xl font-bold mt-1">{documents.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Dipublikasikan</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">{documents.filter(d => d.published).length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Unduhan</p>
                        <p className="text-2xl font-bold mt-1">{totalDownloads}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Draft</p>
                        <p className="text-2xl font-bold mt-1 text-amber-600">{documents.filter(d => !d.published).length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Documents Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Semua Dokumen
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground">Belum ada dokumen. Klik "Unggah Dokumen" untuk menambahkan.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <p className="font-semibold text-sm line-clamp-1">{doc.title}</p>
                                                <Badge variant={(CATEGORY_COLORS[doc.category] as "default" | "destructive" | "outline" | "secondary") || "outline"} className="text-xs shrink-0">
                                                    {DOC_CATEGORIES[doc.category] || doc.category}
                                                </Badge>
                                                {!doc.published && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Draft</Badge>}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{doc.downloadCount}x diunduh</span>
                                                <span>{new Date(doc.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                {doc.uploadedBy && <span>oleh {doc.uploadedBy}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <form action={async () => {
                                            'use server'
                                            await toggleDocumentPublish(doc.id, !doc.published)
                                            revalidatePath('/admin/documents')
                                        }}>
                                            <Button type="submit" variant="ghost" size="sm" className="gap-1 text-xs">
                                                {doc.published ? <><EyeOff className="w-3.5 h-3.5" /> Sembunyikan</> : <><Eye className="w-3.5 h-3.5" /> Tampilkan</>}
                                            </Button>
                                        </form>
                                        <Link href={`/admin/documents/${doc.id}/edit`}>
                                            <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteDocument(doc.id)
                                        }}>
                                            <Button type="submit" variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:bg-destructive/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
