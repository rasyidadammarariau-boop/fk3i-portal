import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"
import { NewsSearch } from "@/components/news-search"
import { Pagination } from "@/components/pagination"

async function getNews(query: string, page: number) {
    const itemsPerPage = 6 // Adjust as needed
    const skip = (page - 1) * itemsPerPage

    try {
        const [data, total] = await Promise.all([
            prisma.news.findMany({
                orderBy: { createdAt: 'desc' },
                where: {
                    published: true,
                    title: {
                        contains: query,
                    }
                },
                take: itemsPerPage,
                skip: skip
            }),
            prisma.news.count({
                where: {
                    published: true,
                    title: {
                        contains: query,
                    }
                }
            })
        ])
        return { data, total, totalPages: Math.ceil(total / itemsPerPage) }
    } catch (e) {
        return { data: [], total: 0, totalPages: 0 }
    }
}

export default async function NewsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        q?: string
        page?: string
    }>
}) {
    const params = await searchParams;
    const query = params?.q || ''
    const currentPage = Number(params?.page) || 1

    const { data: newsList, totalPages } = await getNews(query, currentPage)

    // Featured logic: Only show featured on the first page AND when not searching
    const showFeatured = currentPage === 1 && !query

    // If showing featured, we might want to take it out from the grid list? 
    // Or just treat the first page normally but highlight the first item.
    // For simplicity with pagination, let's just render the grid cleanly when searching/paginating,
    // and only show the special "Featured" header for the very first item on default view.

    let featured = null
    let others = newsList

    if (showFeatured && newsList.length > 0) {
        featured = newsList[0]
        others = newsList.slice(1)
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Header */}
            <div className="bg-primary pt-32 pb-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_10s_ease-in-out_infinite]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Kabar Dari Kampung</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Warta FK3i</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto font-light">Menyajikan informasi terkini seputar kegiatan, opini, dan pergerakan kyai kampung.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <NewsSearch />
            </div>

            <div className="container mx-auto px-6 mt-16">
                {featured && (
                    <div className="mb-16">
                        <Link href={`/news/${new Date(featured.createdAt).getFullYear()}/${String(new Date(featured.createdAt).getMonth() + 1).padStart(2, '0')}/${featured.slug}`} className="group relative block overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                            <div className="relative aspect-[21/9] w-full items-center justify-center bg-gray-200 overflow-hidden">
                                {featured.image ? (
                                    <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary-foreground font-serif text-6xl">FK3i</div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent"></div>
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                                <span className="bg-secondary text-primary text-xs font-bold uppercase px-3 py-1 rounded mb-4 inline-block">Berita Utama</span>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-secondary transition-colors">
                                    {featured.title}
                                </h2>
                                <p className="text-gray-200 text-lg line-clamp-2 md:line-clamp-3 mb-6 font-light">
                                    {featured.content}
                                </p>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(featured.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {others.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {others.map((news) => (
                            <Link key={news.id} href={`/news/${new Date(news.createdAt).getFullYear()}/${String(new Date(news.createdAt).getMonth() + 1).padStart(2, '0')}/${news.slug}`} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    {news.image ? (
                                        <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50 text-sm">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        NEWS
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                                        {new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {news.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
                                        {news.content}
                                    </p>
                                    <span className="text-primary text-sm font-bold group-hover:text-secondary inline-flex items-center">
                                        Baca Selengkapnya <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    !featured && (
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
