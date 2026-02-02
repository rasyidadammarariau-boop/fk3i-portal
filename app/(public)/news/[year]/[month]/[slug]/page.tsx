import prisma from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"
import { Metadata } from 'next'
import { Breadcrumb } from "@/components/ui/breadcrumb-custom"

async function getNewsItem(slug: string) {
    try {
        return await prisma.news.findUnique({
            where: { slug }
        })
    } catch (e) {
        return null
    }
}

async function getRecommendedNews(currentSlug: string) {
    try {
        return await prisma.news.findMany({
            where: {
                slug: {
                    not: currentSlug
                },
                published: true
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        })
    } catch (e) {
        return []
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const news = await getNewsItem(slug)

    if (!news) {
        return {
            title: 'Berita Tidak Ditemukan',
        }
    }

    return {
        title: news.title,
        description: news.content.substring(0, 150) + '...',
        openGraph: {
            images: news.image ? [news.image] : [],
        },
    }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ year: string, month: string, slug: string }> }) {
    const { year, month, slug } = await params
    const news = await getNewsItem(slug)
    const recommended = await getRecommendedNews(slug)

    if (!news || !news.published) {
        notFound()
    }

    return (
        <article className="bg-white min-h-screen pb-24 font-serif">
            {/* Header Image */}
            <div className="relative h-[60vh] w-full bg-gray-900">
                {news.image && (
                    <Image src={news.image} alt={news.title} fill className="object-cover opacity-60" priority />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="container mx-auto max-w-4xl">
                        <Breadcrumb
                            items={[
                                { label: "Berita", href: "/news" },
                                { label: `${year}`, href: `/news/${year}` }, // Optional: Year archive
                                { label: news.title }
                            ]}
                        />
                        <Link href="/news" className="inline-flex items-center text-white/80 hover:text-secondary mb-6 transition-colors text-sm font-sans font-bold uppercase tracking-widest">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Warta
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-shadow">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 font-sans text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">A</div>
                                <span className="font-bold">Admin FK3i</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(news.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white p-8 md:p-16 rounded-t-3xl shadow-2xl">
                    <div className="flex justify-between items-start mb-10 border-b pb-8">
                        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:font-sans prose-p:leading-loose text-gray-700">
                            <p className="whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                                {news.content}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button variant="outline" className="gap-2 rounded-full border-gray-300 font-sans">
                            <Share2 className="w-4 h-4" /> Bagikan Artikel
                        </Button>
                    </div>
                </div>

                {/* Recommended Reading */}
                {recommended.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-serif font-bold text-2xl text-primary">Rekomendasi Bacaan</h3>
                            <Link href="/news" className="text-sm font-bold text-secondary uppercase tracking-widest hover:text-primary transition-colors">Lihat Semua</Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {recommended.map((item) => (
                                <Link key={item.id} href={`/news/${new Date(item.createdAt).getFullYear()}/${String(new Date(item.createdAt).getMonth() + 1).padStart(2, '0')}/${item.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
                                    <div className="relative h-40 w-full bg-gray-200">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs text-muted-foreground mb-2 font-sans">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                                        <h4 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    )
}
