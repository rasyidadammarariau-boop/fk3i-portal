import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock } from "lucide-react"

function newsUrl(news: { slug: string }) {
    return `/news/${news.slug}`
}


async function getRecentNews() {
    try {
        return await prisma.news.findMany({
            take: 4,
            orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
            where: { published: true },
            select: {
                id: true, title: true, slug: true, image: true, content: true, excerpt: true,
                createdAt: true, publishedAt: true, featured: true, readTime: true,
                category: { select: { name: true } }
            }
        })
    } catch { return [] }
}

export default async function NewsSection() {
    const recentNews = await getRecentNews()
    const headline = recentNews[0]
    const sideItems = recentNews.slice(1)

    if (recentNews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-lg mb-2">Belum ada warta berita untuk saat ini.</p>
                <p className="text-sm">Silakan kembali lagi nanti untuk informasi terbaru.</p>
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Headline */}
            {headline && (
                <Link href={newsUrl(headline)} className="group relative block h-full mb-6 lg:mb-0">
                    <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full overflow-hidden grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 rounded-lg">
                        {headline.image ? (
                            <Image
                                src={headline.image}
                                alt={headline.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/30 font-serif text-4xl">
                                BEM Pesantren Indonesia
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-10">
                            <div className="flex items-center gap-2 mb-3">
                                {headline.featured && <Badge variant="secondary" className="font-bold uppercase text-xs">Headline</Badge>}
                                {headline.category?.name && (
                                    <Badge variant="outline" className="bg-black/20 text-white border-white/20 text-xs">
                                        {headline.category.name}
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">
                                {headline.title}
                            </h3>
                            <p className="text-white/80 text-xs md:text-sm line-clamp-2 max-w-lg mb-3">
                                {headline.excerpt || headline.content.replace(/<[^>]*>/g, " ").substring(0, 100) + "..."}
                            </p>
                            {headline.readTime && (
                                <div className="flex items-center gap-1 text-white/60 text-xs">
                                    <Clock className="w-3 h-3" /> {headline.readTime} menit baca
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            )}

            {/* Side list */}
            <div className="flex flex-col gap-6 md:gap-8">
                {sideItems.map((news: typeof sideItems[0], index: number) => (
                    <div key={news.id}>
                        <Link href={newsUrl(news)} className="flex gap-4 md:gap-6 group items-start">
                            <div className="relative w-24 h-20 sm:w-28 sm:h-22 md:w-36 md:h-28 flex-shrink-0 overflow-hidden bg-muted rounded">
                                {news.image && (
                                    <Image
                                        src={news.image}
                                        alt={news.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 25vw, 15vw"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                    {news.category?.name && <span className="text-primary font-bold">{news.category.name}</span>}
                                    {news.category?.name && <span>•</span>}
                                    <span>{new Date(news.publishedAt || news.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                    {news.readTime && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                                <Clock className="w-2.5 h-2.5" />{news.readTime} mnt
                                            </span>
                                        </>
                                    )}
                                </div>
                                <h3 className="text-base md:text-lg font-serif font-semibold text-primary leading-tight group-hover:text-primary/70 transition-colors line-clamp-2">
                                    {news.title}
                                </h3>
                            </div>
                        </Link>
                        {index < sideItems.length - 1 && <Separator className="mt-5" />}
                    </div>
                ))}
            </div>
        </div>
    )
}
