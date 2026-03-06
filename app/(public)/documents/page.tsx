import prisma from "@/lib/prisma"
import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Calendar, FolderOpen } from "lucide-react"
import Link from "next/link"
import { incrementDownloadCount } from "@/app/admin/documents/actions"
import { DOC_CATEGORIES } from "@/app/admin/documents/constants"

export const metadata: Metadata = {
    title: 'Repositori Dokumen | BEM Pesantren Indonesia',
    description: 'Unduh AD/ART, GBHO, SK, SOP, dan dokumen resmi BEM Pesantren Indonesia.',
}

const CATEGORY_TABS = [
    ["", "Semua"],
    ["ad-art", "AD/ART"],
    ["gbho", "GBHO"],
    ["sk", "Surat Keputusan"],
    ["sop", "SOP & Panduan"],
    ["surat", "Surat Resmi"],
    ["umum", "Umum"],
]

function getExt(filename: string) {
    return filename.split('.').pop()?.toUpperCase() || 'FILE'
}

async function getDocuments(category?: string) {
    try {
        return await prisma.orgDocument.findMany({
            where: {
                published: true,
                ...(category ? { category } : {})
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch { return [] }
}

export default async function DocumentsPage({
    searchParams
}: {
    searchParams?: Promise<{ cat?: string }>
}) {
    const params = await searchParams
    const catFilter = params?.cat || ""
    const documents = await getDocuments(catFilter)

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Hero */}
            <div className="bg-background border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                    <Badge variant="outline" className="font-bold tracking-widest uppercase text-xs mb-3 max-w-max">
                        Konstitusi & Regulasi
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-3">
                        Repositori Dokumen
                    </h1>
                    <p className="text-base sm:text-lg max-w-2xl mx-auto font-light text-muted-foreground">
                        AD/ART, GBHO, Surat Keputusan, SOP, dan dokumen resmi organisasi yang dapat diunduh kapan saja.
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="container mx-auto px-6 mt-8 flex flex-wrap gap-2 justify-center">
                {CATEGORY_TABS.map(([val, label]) => (
                    <Link
                        key={val}
                        href={val ? `/documents?cat=${val}` : "/documents"}
                        className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${catFilter === val
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground/30"
                            }`}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* Count info */}
            {documents.length > 0 && (
                <div className="container mx-auto px-4 md:px-6 mt-8">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-semibold text-foreground">{documents.length}</span> dokumen
                        {catFilter && CATEGORY_TABS.find(([v]) => v === catFilter) && (
                            <> dalam kategori <span className="font-semibold text-foreground">{CATEGORY_TABS.find(([v]) => v === catFilter)?.[1]}</span></>
                        )}
                    </p>
                    <Separator className="mt-3" />
                </div>
            )}

            {/* Documents Grid */}
            <div className="container mx-auto px-4 md:px-6 mt-6">
                {documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                            <FolderOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-lg mb-1">Belum ada dokumen</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            {catFilter ? "Belum ada dokumen dalam kategori ini." : "Repositori dokumen masih kosong."}
                        </p>
                        {catFilter && (
                            <Link href="/documents">
                                <Button variant="outline" size="sm">← Lihat semua dokumen</Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {documents.map((doc) => {
                            const ext = getExt(doc.fileName)
                            return (
                                <Card key={doc.id} className="border-border hover:border-foreground/20 hover:shadow-md transition-all duration-200 group">
                                    <CardContent className="p-5 flex flex-col gap-4">
                                        {/* Header */}
                                        <div className="flex items-start gap-3">
                                            {/* File type indicator */}
                                            <div className="w-11 h-11 rounded-lg bg-muted border border-border flex items-center justify-center text-[10px] font-black uppercase shrink-0 text-muted-foreground tracking-widest">
                                                {ext}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Badge variant="outline" className="text-xs mb-1.5 font-semibold">
                                                    {DOC_CATEGORIES[doc.category] || doc.category}
                                                </Badge>
                                                <h3 className="font-serif font-bold text-sm leading-snug line-clamp-2">
                                                    {doc.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {doc.description && (
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                {doc.description}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(doc.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Download className="w-3 h-3" />
                                                    {doc.downloadCount}x
                                                </span>
                                            </div>

                                            {/* Download — server action via form submit */}
                                            <form action={async () => {
                                                'use server'
                                                await incrementDownloadCount(doc.id)
                                            }}>
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-xs gap-1.5"
                                                    formAction={async () => {
                                                        'use server'
                                                        await incrementDownloadCount(doc.id)
                                                    }}
                                                    onClick={undefined}
                                                    asChild
                                                >
                                                    <a href={doc.fileUrl} download={doc.fileName}>
                                                        <Download className="w-3 h-3" /> Unduh
                                                    </a>
                                                </Button>
                                            </form>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
