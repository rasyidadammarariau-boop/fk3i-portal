import prisma from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag as TagIcon, Eye } from "lucide-react"
import { Metadata } from "next"
import { Breadcrumb } from "@/components/ui/breadcrumb-custom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { incrementViews } from "@/app/admin/news/actions"
import { ShareButtonClient } from "@/components/share-button"
import { FileDown, FileText } from "lucide-react"
// (Dibuang tipe label statis karena sudah menggunakan dynamic categories)
async function getNewsItem(slug: string) {
    try {
        return await prisma.news.findUnique({
            where: { slug },
            include: {
                category: { select: { name: true, slug: true } },
                tagRelations: { include: { tag: { select: { name: true, slug: true } } } }
            }
        })
    } catch { return null }
}

async function getRelatedNews(currentId: string, categoryId?: string | null) {
    try {
        return await prisma.news.findMany({
            where: {
                id: { not: currentId },
                published: true,
                ...(categoryId ? { categoryId } : {}),
            },
            take: 3,
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
            select: {
                id: true, title: true, slug: true, image: true,
                excerpt: true, readTime: true, createdAt: true, publishedAt: true,
                category: { select: { name: true } }
            }
        })
    } catch { return [] }
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const news = await getNewsItem(slug)
    if (!news) return { title: "Berita Tidak Ditemukan" }

    const description = news.metaDescription || news.excerpt || news.content.replace(/<[^>]*>/g, " ").substring(0, 155)
    const title = news.metaTitle || news.title

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: news.image ? [news.image] : [],
            type: "article",
            publishedTime: (news.publishedAt || news.createdAt).toISOString(),
            authors: news.author ? [news.author] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: news.image ? [news.image] : [],
        }
    }
}

export default async function NewsDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const news = await getNewsItem(slug)

    if (!news || !news.published) notFound()

    const related = await getRelatedNews(news.id, news.categoryId)
    const publishDate = news.publishedAt || news.createdAt
    const tags = news.tagRelations.map((tr) => tr.tag)

    // Increment views (fire and forget)
    incrementViews(news.id).catch(() => { })

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/news/${slug}`

    return (
        <article className="bg-background min-h-screen pb-24">
            {/* Hero Image */}
            <div className="relative h-[65vh] w-full bg-gray-900">
                {news.image && (
                    <Image src={news.image} alt={news.title} fill className="object-cover opacity-60" priority />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="container mx-auto max-w-4xl">
                        <Breadcrumb
                            items={[
                                { label: "Berita", href: "/news" },
                                { label: news.title }
                            ]}
                        />
                        <Link href="/news" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm font-sans font-bold uppercase tracking-widest">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Warta
                        </Link>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {news.category && (
                                <Link href={`/news?category=${news.category.slug}`}>
                                    <Badge variant="outline" className="text-white border-white/30 hover:bg-white/10 text-xs">
                                        {news.category.name}
                                    </Badge>
                                </Link>
                            )}
                            {news.featured && (
                                <Badge className="bg-amber-500 text-white text-xs">Unggulan</Badge>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4 md:mb-6">
                            {news.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-5 text-white/80 text-sm font-sans">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {(news.author || "A").charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold">{news.author || "Admin BEM Pesantren Indonesia"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(publishDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </div>
                            {news.readTime && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {news.readTime} menit baca
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                {(news.views || 0).toLocaleString("id-ID")} pembaca
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Body */}
            <div className="container mx-auto px-6 max-w-4xl -mt-10 relative z-20">
                <Card className="rounded-t-3xl shadow-2xl border-none">
                    <CardContent className="p-8 md:p-16">

                        {/* Excerpt */}
                        {news.excerpt && (
                            <div className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-8 leading-relaxed">
                                {news.excerpt}
                            </div>
                        )}

                        <div
                            className="prose prose-lg dark:prose-invert max-w-none font-serif leading-loose
                                prose-headings:font-serif prose-headings:tracking-tight
                                prose-p:leading-loose prose-p:break-words
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-xl prose-img:shadow-md
                                prose-blockquote:border-primary prose-blockquote:italic"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        {/* Lampiran PDF */}
                        {news.attachmentUrl && (
                            <div className="mt-12 mb-8 not-prose">
                                <Card className="bg-primary/5 hover:bg-primary/10 transition-colors border-primary/20">
                                    <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">Dokumen Lampiran Tersedia</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-1 break-all">
                                                    {news.attachmentName || "Dokumen-BEM.pdf"}
                                                </p>
                                            </div>
                                        </div>
                                        <a href={news.attachmentUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                            <Button size="lg" className="w-full gap-2 font-bold shadow-md hover:shadow-lg transition-all">
                                                <FileDown className="w-5 h-5" />
                                                Unduh Dokumen
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <Separator className="my-10" />

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-8">
                                <TagIcon className="w-4 h-4 text-muted-foreground" />
                                {tags.map((tag) => (
                                    <Link key={tag.slug} href={`/news?tag=${tag.slug}`}>
                                        <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                                            #{tag.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Share */}
                        <ShareButtonClient url={shareUrl} title={news.title} />
                    </CardContent>
                </Card>

                {/* Related Articles */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-serif font-bold text-2xl">
                                Baca Juga
                                {news.category && <span className="text-muted-foreground text-lg ml-2">— {news.category.name}</span>}
                            </h3>
                            <Link href="/news" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors text-muted-foreground">
                                Lihat Semua →
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {related.map((item) => (
                                <Link key={item.id} href={`/news/${item.slug}`} className="group outline-none">
                                    <Card className="rounded-xl overflow-hidden hover:shadow-lg transition-all h-full">
                                        <div className="relative h-44 w-full bg-muted">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Tidak ada gambar</div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            {item.category?.name && (
                                                <Badge variant="outline" className="text-xs mb-2">{item.category.name}</Badge>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.publishedAt || item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                                {item.readTime && (
                                                    <><span>•</span><Clock className="w-3 h-3" />{item.readTime} mnt</>
                                                )}
                                            </div>
                                            <h4 className="font-serif font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    )
}
