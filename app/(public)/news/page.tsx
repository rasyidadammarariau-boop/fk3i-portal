import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Tag } from "lucide-react"
import { NewsSearch } from "@/components/news-search"
import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

/** Label ramah tampilan untuk tipe artikel */
const TYPE_LABELS: Record<string, string> = {
    berita: "Berita",
    artikel: "Artikel",
    pengumuman: "Pengumuman",
    "siaran-pers": "Siaran Pers",
    kajian: "Kajian Isu",
}

/** Format tanggal terbit — pakai publishedAt jika ada, fallback createdAt */
function formatDate(news: { publishedAt?: Date | null; createdAt: Date }, options?: Intl.DateTimeFormatOptions) {
    const date = news.publishedAt || news.createdAt
    return new Date(date).toLocaleDateString("id-ID", options || { day: "numeric", month: "long", year: "numeric" })
}

/** URL path artikel — langsung /news/[slug] */
function newsUrl(news: { slug: string }) {
    return `/news/${news.slug}`
}


async function getFeaturedNews() {
    try {
        return await prisma.news.findFirst({
            where: { published: true, featured: true },
            orderBy: { publishedAt: "desc" },
            select: {
                id: true, title: true, slug: true, excerpt: true, content: true,
                image: true, createdAt: true, publishedAt: true,
                readTime: true, author: true, tags: true, attachmentUrl: true,
                category: { select: { name: true } }
            }
        })
    } catch { return null }
}

async function getNews(query: string, page: number) {
    const itemsPerPage = 6
    const skip = (page - 1) * itemsPerPage

    const where = {
        published: true,
        ...(query ? { title: { contains: query } } : {}),
    }

    try {
        const [data, total] = await Promise.all([
            prisma.news.findMany({
                where,
                orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
                take: itemsPerPage,
                skip,
                select: {
                    id: true, title: true, slug: true, excerpt: true, content: true,
                    image: true, createdAt: true, publishedAt: true,
                    readTime: true, tags: true, attachmentUrl: true,
                    category: { select: { name: true } }
                }
            }),
            prisma.news.count({ where })
        ])
        return { data, total, totalPages: Math.ceil(total / itemsPerPage) }
    } catch {
        return { data: [], total: 0, totalPages: 0 }
    }
}

export default async function NewsPage({
    searchParams,
}: {
    searchParams?: Promise<{ q?: string; page?: string; category?: string }>
}) {
    const params = await searchParams
    const query = params?.q || ""
    const currentPage = Number(params?.page) || 1
    const categoryFilter = params?.category || ""

    // Ambil featured dari DB (bukan hanya item pertama)
    const featuredNews = !query && !categoryFilter && currentPage === 1
        ? await getFeaturedNews()
        : null

    const { data: newsList, totalPages } = await getNews(query, currentPage)

    // Exclude featured dari grid jika sudah tampil di hero
    const others = featuredNews
        ? newsList.filter((n: { id: string }) => n.id !== featuredNews.id)
        : newsList

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="bg-background border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_10s_ease-in-out_infinite]" />
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                    <Badge variant="outline" className="font-bold tracking-widest uppercase text-xs md:text-sm mb-3 md:mb-4 block max-w-max mx-auto bg-primary/5 text-primary border-primary/20">
                        Kabar Dari Kami
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-3 md:mb-4">Warta BEM Pesantren</h1>
                    <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light text-muted-foreground">
                        Informasi terkini kegiatan, opini, dan pergerakan mahasiswa santri Indonesia.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="container mx-auto px-4 md:px-6 -mt-6 md:-mt-10 relative z-20">
                <NewsSearch />
            </div>

            {/* Type filters (removed) */}
            <div className="container mx-auto px-6 mt-8">
            </div>

            <div className="container mx-auto px-6 mt-12">
                {/* Featured Hero */}
                {featuredNews && (
                    <div className="mb-16">
                        <Link href={newsUrl(featuredNews)} className="group relative block outline-none">
                            <Card className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none">
                                <div className="relative aspect-[21/9] w-full bg-muted overflow-hidden">
                                    {featuredNews.image ? (
                                        <Image src={featuredNews.image} alt={featuredNews.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 font-serif text-4xl text-primary/30">BEM Pesantren Indonesia</div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="secondary" className="font-bold uppercase">Unggulan</Badge>
                                        {featuredNews.category?.name && (
                                            <Badge variant="outline" className={`bg-black/20 text-white border-white/20`}>
                                                {featuredNews.category.name}
                                            </Badge>
                                        )}
                                        {featuredNews.attachmentUrl && (
                                            <Badge variant="outline" className="bg-blue-500/80 text-white border-white/20 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                                Dokumen
                                            </Badge>
                                        )}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-secondary transition-colors">
                                        {featuredNews.title}
                                    </h2>
                                    <p className="text-gray-200 text-lg line-clamp-2 mb-4 font-light">
                                        {featuredNews.excerpt || featuredNews.content.replace(/<[^>]*>/g, " ").substring(0, 150) + "..."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(featuredNews, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                        </div>
                                        {featuredNews.readTime && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {featuredNews.readTime} menit baca
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                )}

                {/* News Grid */}
                {others.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {others.map((news: typeof others[0]) => (
                            <Link key={news.id} href={newsUrl(news)} className="group outline-none">
                                <Card className="flex flex-col h-full overflow-hidden hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        {news.image ? (
                                            <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted text-sm text-muted-foreground">Tidak ada gambar</div>
                                        )}
                                        {news.category?.name && (
                                            <Badge variant="outline" className={`absolute top-4 left-4 bg-background/90 text-primary backdrop-blur font-bold`}>
                                                {news.category.name}
                                            </Badge>
                                        )}
                                        {news.attachmentUrl && (
                                            <Badge variant="outline" className="absolute top-4 right-4 bg-blue-500/90 text-white backdrop-blur font-bold border-none" title="Ada Lampiran PDF">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                            </Badge>
                                        )}
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(news)}
                                            {news.readTime && (
                                                <>
                                                    <span>•</span>
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {news.readTime} mnt
                                                </>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-serif font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed flex-1">
                                            {news.excerpt || news.content.replace(/<[^>]*>/g, " ").substring(0, 120) + "..."}
                                        </p>
                                        {/* Tags */}
                                        {news.tags && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {news.tags.split(",").slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Tag className="w-2.5 h-2.5" />{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <span className="text-primary text-sm font-bold group-hover:text-primary/70 inline-flex items-center">
                                            Baca Selengkapnya <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    !featuredNews && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">Tidak ada berita yang ditemukan.</p>
                        </div>
                    )
                )}

                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
