import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function NewsMonthPage({ params }: { params: Promise<{ year: string, month: string }> }) {
    const { year, month } = await params
    const yearNum = parseInt(year)
    const monthNum = parseInt(month)

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) notFound()

    // Calculate start and end date for the month
    // Note: Month in JS Date is 0-indexed, but URL is 1-indexed (01 = Jan)
    const startDate = new Date(yearNum, monthNum - 1, 1)
    const endDate = new Date(yearNum, monthNum, 1) // First day of next month

    const newsList = await prisma.news.findMany({
        where: {
            published: true,
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const monthName = startDate.toLocaleDateString('id-ID', { month: 'long' })

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Header */}
            <div className="bg-primary pt-32 pb-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_10s_ease-in-out_infinite]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Arsip Berita</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{monthName} {year}</h1>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16">
                {newsList.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {newsList.map((news) => (
                            <Link key={news.id} href={`/news/${new Date(news.createdAt).getFullYear()}/${String(new Date(news.createdAt).getMonth() + 1).padStart(2, '0')}/${news.slug}`} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    {news.image ? (
                                        <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50 text-sm">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        ARCHIVE
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
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">Tidak ada berita untuk periode ini.</p>
                        <Link href="/news">
                            <button className="mt-4 text-primary font-bold hover:underline">Kembali ke Semua Berita</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
