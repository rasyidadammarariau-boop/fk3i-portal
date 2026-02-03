import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Users, Building, Calendar, MapPin, ChevronRight, Activity, HandHeart } from "lucide-react"

async function getRecentNews() {
    try {
        return await prisma.news.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            where: { published: true }
        })
    } catch (e) {
        return []
    }
}

async function getRecentGallery() {
    try {
        // Fetch both albums and standalone images
        const [albums, standaloneImages] = await Promise.all([
            prisma.galleryAlbum.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                where: { published: true }
            }),
            prisma.galleryImage.findMany({
                take: 2,
                orderBy: { createdAt: 'desc' },
                where: {
                    published: true,
                    albumId: null // Only standalone photos
                }
            })
        ])

        // Combine and format for display
        const galleryItems = [
            ...albums.map(album => ({
                id: album.id,
                title: album.title,
                image: album.cover,
                type: 'album' as const,
                slug: album.slug
            })),
            ...standaloneImages.map(img => ({
                id: img.id,
                title: img.title || 'Foto',
                image: img.url,
                type: 'image' as const,
                slug: img.id // Use ID for standalone images
            }))
        ].slice(0, 5) // Take max 5 items total

        return galleryItems
    } catch (e) {
        return []
    }
}

async function getStats() {
    try {
        const news = await prisma.news.count()
        const [albums, standaloneImages] = await Promise.all([
            prisma.galleryAlbum.count(),
            prisma.galleryImage.count({ where: { albumId: null } })
        ])
        const gallery = albums + standaloneImages
        return { news, gallery, members: 1540, branches: 34 }
    } catch (e) {
        return { news: 0, gallery: 0, members: 0, branches: 0 }
    }
}

async function getRecentAgenda() {
    try {
        return await prisma.agenda.findMany({
            take: 3,
            orderBy: { date: 'asc' },
            where: {
                published: true,
                date: { gte: new Date() }
            }
        })
    } catch (e) {
        return []
    }
}

export default async function Home() {
    const recentNews = await getRecentNews()
    const recentGallery = await getRecentGallery()
    const stats = await getStats()
    const recentAgenda = await getRecentAgenda()

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc]">
            {/* Hero Section - Executive Style */}
            <section className="relative min-h-screen flex items-center justify-center bg-primary text-primary-foreground overflow-hidden">
                {/* Subtle geometric pattern */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium tracking-wide text-secondary uppercase">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span> Official Portal
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] tracking-tight">
                            Menjaga Tradisi, <br />
                            <span className="text-secondary italic">Merawat</span> Pertiwi.
                        </h1>
                        <p className="text-lg md:text-xl opacity-80 max-w-lg leading-relaxed font-light">
                            Forum Kyai Kampung Indonesia (FK3i) hadir sebagai oase kesejukan di tengah dinamika bangsa, menyuarakan Islam yang ramah, moderat, dan bermartabat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/about">
                                <Button size="lg" className="h-14 px-8 rounded-none border border-white/20 bg-white text-primary hover:bg-secondary hover:text-white transition-all duration-300 font-medium">
                                    Pelajari FK3i
                                </Button>
                            </Link>
                            <Link href="/news">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-none border-white/50 text-white hover:bg-white/10 hover:border-white transition-all font-medium">
                                    Baca Warta
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Decoration/Image */}
                    <div className="md:w-1/2 relative hidden md:block">
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Placeholder for a main engaging image */}
                                <div className="glass p-8 rounded-2xl max-w-md text-center">
                                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                                        <HandHeart className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">Khidmat Untuk Umat</h2>
                                    <p className="opacity-80 text-sm">Dedikasi tanpa batas untuk kemaslahatan masyarakat Indonesia di tingkat akar rumput.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
                </div>
            </section>

            {/* Mission / Intro Section - Clean Layout */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3 sticky top-24">
                            <h2 className="text-sm font-bold tracking-widest text-primary/80 uppercase mb-4">Filosofi Kami</h2>
                            <h3 className="text-4xl md:text-5xl font-serif font-medium text-primary leading-tight mb-6">
                                Dari Kampung, <br />Untuk Indonesia.
                            </h3>
                            <div className="w-12 h-1 bg-secondary rounded-full mb-6"></div>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Kyai Kampung adalah garda terdepan penjaga moral bangsa. Kami bergerak dalam sunyi, namun karya nyata kami dirasakan hingga ke pelosok negeri.
                            </p>
                            <Button variant="link" className="p-0 h-auto text-primary font-bold group">
                                Visi & Misi Selengkapnya <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        <div className="md:w-2/3 grid sm:grid-cols-2 gap-8">
                            <div className="space-y-4 p-8 bg-muted/30 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold font-serif text-primary">Dakwah Santun</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Menyebarkan ajaran Islam yang Rahmatan Lil Alamin, menjunjung tinggi toleransi dan kearifan lokal.
                                </p>
                            </div>
                            <div className="space-y-4 p-8 bg-muted/30 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 mt-0 sm:mt-12">
                                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold font-serif text-primary">Pemberdayaan Umat</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Mendorong kemandirian ekonomi dan penguatan kapasitas masyarakat melalui pesantren dan majelis taklim.
                                </p>
                            </div>
                            <div className="space-y-4 p-8 bg-muted/30 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                                    <Building className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold font-serif text-primary">Kebangsaan</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Menjadi perekat persatuan bangsa, menjaga nilai-nilai Pancasila dan UUD 1945 dalam bingkai NKRI.
                                </p>
                            </div>
                            <div className="space-y-4 p-8 bg-muted/30 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 mt-0 sm:mt-12">
                                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold font-serif text-primary">Respons Sosial</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Tanggap terhadap isu-isu sosial kemasyarakatan dan turut andil dalam penyelesaian masalah bangsa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats - Minimalist */}
            <section className="py-16 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/10">
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats.members}</div>
                            <div className="text-sm tracking-widest uppercase opacity-70">Anggota Terdaftar</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats.branches}</div>
                            <div className="text-sm tracking-widest uppercase opacity-70">Provinsi</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats.news}</div>
                            <div className="text-sm tracking-widest uppercase opacity-70">Publikasi</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats.gallery}</div>
                            <div className="text-sm tracking-widest uppercase opacity-70">Kegiatan</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured News - Magazine Style */}
            <section className="py-24 bg-[#f8f8f8]">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16 border-b border-gray-200 pb-6">
                        <h2 className="text-4xl font-serif font-bold text-primary">Warta Terkini</h2>
                        <Link href="/news" className="text-sm font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                            Lihat Arsip Berita
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {recentNews[0] && (
                            <Link href={`/news/${new Date(recentNews[0].createdAt).getFullYear()}/${String(new Date(recentNews[0].createdAt).getMonth() + 1).padStart(2, '0')}/${recentNews[0].slug}`} className="group relative block h-full">
                                <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full overflow-hidden grayscale-[20%] group-hover:grayscale-0 transition-all duration-700">
                                    {recentNews[0].image ? (
                                        <Image src={recentNews[0].image} alt={recentNews[0].title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/30 font-serif text-4xl">FK3i</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8 md:p-12">
                                        <div className="bg-secondary text-primary text-xs font-bold uppercase px-3 py-1 inline-block mb-4">Headline</div>
                                        <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight group-hover:underline decoration-1 underline-offset-4">
                                            {recentNews[0].title}
                                        </h3>
                                        <p className="text-gray-300 line-clamp-2 md:line-clamp-3 max-w-lg">
                                            {recentNews[0].content}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        <div className="flex flex-col gap-8">
                            {recentNews.slice(1).map((news) => (
                                <Link key={news.id} href={`/news/${new Date(news.createdAt).getFullYear()}/${String(new Date(news.createdAt).getMonth() + 1).padStart(2, '0')}/${news.slug}`} className="flex gap-6 group items-start border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                                    <div className="relative w-32 h-24 md:w-48 md:h-32 flex-shrink-0 overflow-hidden bg-gray-200">
                                        {news.image && (
                                            <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                            <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-secondary rounded-full"></span>
                                            <span>Berita</span>
                                        </div>
                                        <h3 className="text-xl font-serif font-semibold text-primary leading-tight group-hover:text-secondary transition-colors mb-2">
                                            {news.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            {news.content.substring(0, 100)}...
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery - Asymmetric Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-4">Dokumentasi Kegiatan</h2>
                        <p className="text-muted-foreground">Merekam jejak langkah perjuangan para kyai di berbagai daerah.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 md:auto-rows-[300px]">
                        {recentGallery.map((item, i) => (
                            <Link
                                key={item.id}
                                href={item.type === 'album' ? `/gallery/${item.slug}` : `/gallery/photo/${item.slug}`}
                                className={`group relative overflow-hidden bg-gray-100 ${i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1"}`}
                            >
                                {item.image ? (
                                    <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/30 font-serif text-4xl">FK3i</div>
                                )}
                                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-serif text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-white/60 text-xs uppercase tracking-wider">
                                            {item.type === 'album' ? 'Album Foto' : 'Foto Lepas'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/gallery">
                            <Button variant="outline" className="px-8 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                Lihat Semua Dokumentasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Agenda & Kegiatan Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Jadwal Kami</span>
                            <h2 className="text-4xl font-serif font-bold text-primary">Agenda Mendatang</h2>
                        </div>
                        <Button variant="outline" className="mt-4 md:mt-0">Lihat Semua Agenda</Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {recentAgenda.length > 0 ? (
                            recentAgenda.map((item) => {
                                const agendaDate = new Date(item.date)
                                const monthNames = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"]
                                return (
                                    <Link key={item.id} href={`/agenda/${item.slug}`} className="group flex gap-6 p-6 rounded-2xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 bg-primary/5 rounded-xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="text-2xl font-bold font-serif">{agendaDate.getDate()}</span>
                                            <span className="text-xs tracking-widest uppercase font-medium">{monthNames[agendaDate.getMonth()]}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold font-serif text-primary mb-2 line-clamp-2 leading-tight group-hover:text-secondary transition-colors">{item.title}</h3>
                                            <div className="flex items-center text-muted-foreground text-sm">
                                                <MapPin className="w-3 h-3 mr-2" />
                                                {item.location}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className="col-span-3 text-center py-12 text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>Belum ada agenda yang dijadwalkan</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Kata Tokoh / Social Proof */}
            <section className="py-24 bg-primary text-white relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <div className="w-16 h-1 bg-secondary mx-auto mb-8"></div>
                    <blockquote className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
                        "Pesantren dan Kyai Kampung adalah paku bumi yang menjaga keseimbangan spiritual dan sosial bangsa ini. Kehadiran FK3i sangat vital untuk mengorkestrasi potensi besar tersebut."
                    </blockquote>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full mb-4 overflow-hidden relative border-2 border-secondary">
                            {/* Placeholder Avatar */}
                            <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop" width={80} height={80} alt="Tokoh" className="object-cover" />
                        </div>
                        <div className="font-bold text-xl">KH. Ahmad Zaini</div>
                        <div className="text-secondary text-sm uppercase tracking-widest opacity-80">Ketua Dewan Penasihat FK3i</div>
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Bergabunglah dalam Gerakan Kami</h2>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">
                        Dapatkan informasi terbaru mengenai kegiatan, kajian, dan pergerakan Forum Kyai Kampung Indonesia langsung di kotak masuk Anda.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
                        <Button size="lg" className="w-full bg-secondary text-primary hover:bg-white hover:text-primary font-bold">
                            Mendaftar Anggota
                        </Button>
                        <Link href="/about" className="w-full">
                            <Button size="lg" variant="outline" className="w-full border-white/50 text-white hover:bg-white/10">
                                Hubungi Sekretariat
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
