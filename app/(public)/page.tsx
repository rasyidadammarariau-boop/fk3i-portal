import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Users, Building, Activity, HandHeart } from "lucide-react"
import { Suspense } from "react"
import StatsSection from "@/components/home/stats-section"
import NewsSection from "@/components/home/news-section"
import GallerySection from "@/components/home/gallery-section"
import { StatsSkeleton, NewsSkeleton, GallerySkeleton } from "@/components/home/skeletons"
import prisma from "@/lib/prisma"

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch {
        return null
    }
}

export default async function Home() {
    const profile = await getOrganizationProfile()

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BEM Pesantren Indonesia",
        "alternateName": "BEM Pesantren Indonesia",
        "url": "https://bem-pesantren.or.id",
        "logo": "https://bem-pesantren.or.id/logo.png",
        "description": profile?.shortDescription || "Organisasi mahasiswa santri Indonesia yang bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan mahasiswa pesantren di seluruh Indonesia.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": profile?.city || "Jakarta",
            "addressRegion": profile?.province || "DKI Jakarta",
            "addressCountry": "ID"
        },
        "sameAs": [
            profile?.facebook || "https://facebook.com/bempesantren",
            profile?.twitter || "https://twitter.com/bempesantren",
            profile?.instagram || "https://instagram.com/bempesantren"
        ].filter(Boolean)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-background overflow-hidden pt-28 pb-12 md:py-0">
                {/* Subtle geometric pattern */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-muted/20 to-background pointer-events-none"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="w-full md:w-1/2 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center md:text-left">
                        <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 text-[10px] md:text-xs">
                            <span className="w-2 h-2 rounded-full bg-primary"></span> Official Portal
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight ">
                            Menjaga Tradisi, <br />
                            <span className="text-primary italic">Merawat</span> Pertiwi.
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl max-w-lg leading-relaxed font-light mx-auto md:mx-0">
                            {profile?.shortDescription || "BEM Pesantren Indonesia hadir sebagai wadah mahasiswa santri untuk memperkuat keagamaan, keilmuan, dan pemberdayaan pesantren di seluruh nusantara."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center md:justify-start">
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button size="lg" >
                                    Pelajari BEM Pesantren Indonesia
                                </Button>
                            </Link>
                            <Link href="/news" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" >
                                    Baca Warta
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Decoration */}
                    <div className="w-full md:w-1/2 relative mt-12 md:mt-0 flex justify-center">
                        <div className="relative w-full aspect-square max-w-[260px] sm:max-w-md md:max-w-lg mx-auto">
                            <div className="absolute inset-0 border border-foreground/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-foreground/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className=" p-5 md:p-8 rounded-2xl max-w-[90%] md:max-w-md text-center bg-background/50 backdrop-blur-md border border-border shadow-sm">
                                    <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-primary">
                                        <HandHeart className="w-5 h-5 md:w-8 md:h-8" />
                                    </div>
                                    <h2 className="text-base md:text-xl font-bold mb-2">Khidmat Untuk Umat</h2>
                                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 md:line-clamp-none">
                                        {profile?.mission?.split('\n')[0]?.replace(/^\d+\.\s*/, '') || "Menghidupkan dan meramaikan eksistensi mahasiswa santri dalam ranah lokal, regional maupun nasional."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-foreground to-transparent"></div>
                </div>
            </section>

            {/* Mission / Intro Section */}
            <section className="py-12 md:py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                        <div className="w-full lg:w-1/3 relative lg:sticky lg:top-24">
                            <h2 className="text-xs md:text-sm font-bold tracking-widest text-primary/80 uppercase mb-3 md:mb-4">Filosofi Kami</h2>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-primary leading-tight mb-4 md:mb-6">
                                Dari Pesantren, <br />Untuk Indonesia.
                            </h3>
                            <Separator className="w-12 h-1 bg-secondary rounded-full mb-4 md:mb-6" />
                            <p className=" leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                                {profile?.longDescription || "BEM Pesantren Indonesia adalah organisasi mahasiswa santri yang menghimpun para mahasiswa dari pesantren seluruh Indonesia untuk bersama-sama mengembangkan keilmuan, keagamaan, dan pemberdayaan umat berbasis pesantren."}
                            </p>
                            <Link href="/about">
                                <Button variant="link" className="p-0 h-auto text-primary font-bold group">
                                    Visi & Misi Selengkapnya <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        <div className="w-full lg:w-2/3 grid sm:grid-cols-2 gap-6 md:gap-8">
                            <Card className="hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-muted/30">
                                <CardContent className="space-y-4 p-6 md:p-8">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-md">
                                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold font-serif ">Keilmuan</h4>
                                    <p className=" text-xs md:text-sm leading-relaxed">
                                        Menghidupkan dan meramaikan eksistensi mahasiswa santri dalam ranah lokal, regional maupun nasional.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-muted/30 sm:mt-12">
                                <CardContent className="space-y-4 p-6 md:p-8">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-md">
                                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold font-serif ">Persaudaraan</h4>
                                    <p className=" text-xs md:text-sm leading-relaxed">
                                        Menjalin rasa persahabatan mahasiswa santri se-Indonesia dan memperkuat ikatan silaturahmi.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-muted/30">
                                <CardContent className="space-y-4 p-6 md:p-8">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-md">
                                        <Building className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold font-serif ">Kebangsaan</h4>
                                    <p className=" text-xs md:text-sm leading-relaxed">
                                        Menjalin kerjasama antar mahasiswa santri dan pemerintah guna memajukan pesantren di seluruh Indonesia.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-muted/30 sm:mt-12">
                                <CardContent className="space-y-4 p-6 md:p-8">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-md">
                                        <Activity className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold font-serif ">Kaderisasi</h4>
                                    <p className=" text-xs md:text-sm leading-relaxed">
                                        Merumuskan sistem kaderisasi dan regenerasi dalam bidang keilmuan, ekonomi, politik, dan teknologi.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 md:py-16 bg-muted/30 border-y">
                <div className="container mx-auto px-4 md:px-6">
                    <Suspense fallback={<StatsSkeleton />}>
                        <StatsSection />
                    </Suspense>
                </div>
            </section>

            {/* Featured News */}
            <section className="py-12 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 border-b border-gray-200 pb-4 md:pb-6 gap-4 md:gap-0">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary">Warta Terkini</h2>
                        <Link href="/news" className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                            Lihat Arsip Berita
                        </Link>
                    </div>

                    <Suspense fallback={<NewsSkeleton />}>
                        <NewsSection />
                    </Suspense>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-12 md:py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-2 md:mb-4">Dokumentasi Kegiatan</h2>
                        <p className=" text-sm md:text-base">Merekam jejak pergerakan mahasiswa santri di berbagai daerah.</p>
                    </div>

                    <Suspense fallback={<GallerySkeleton />}>
                        <GallerySection />
                    </Suspense>

                    <div className="text-center mt-8 md:mt-12">
                        <Link href="/gallery">
                            <Button variant="outline" className="px-6 md:px-8 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                Lihat Semua Dokumentasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* CTA */}
            <section className="py-16 md:py-24 bg-background relative overflow-hidden border-t border-border">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/50 skew-x-12 transform translate-x-1/2"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <h2 className="text-2xl md:text-5xl font-serif font-bold mb-4 md:mb-6 ">Bergabunglah dalam Gerakan Kami</h2>
                    <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
                        {profile?.shortDescription
                            ? `${profile.shortDescription} Hubungi sekretariat kami untuk informasi lebih lanjut.`
                            : "Bersama BEM Pesantren Indonesia, kita wujudkan mahasiswa santri yang bertaqwa, berilmu, berakhlaqul karimah, dan cinta tanah air."
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3 md:gap-4">
                        <Link href="/contact" className="w-full">
                            <Button size="lg" className="w-full h-12 md:h-14 font-bold">
                                Hubungi Kami
                            </Button>
                        </Link>
                        <Link href="/about" className="w-full">
                            <Button size="lg" variant="outline" className="w-full h-12 md:h-14">
                                Tentang Organisasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
