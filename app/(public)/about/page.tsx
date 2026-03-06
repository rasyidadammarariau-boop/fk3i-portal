import { Button } from "@/components/ui/button"
import { Globe2, HeartHandshake, ShieldCheck } from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
    const profile = await prisma.organizationProfile.findUnique({ where: { id: "default" } }).catch(() => null)
    const orgName = profile?.name || "BEM Pesantren Indonesia"
    return {
        title: `Tentang Kami | ${orgName}`,
        description: profile?.shortDescription || `Mengenal lebih dekat ${orgName}, organisasi mahasiswa santri Indonesia yang bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan.`,
        openGraph: {
            title: `Tentang Kami | ${orgName}`,
            description: profile?.shortDescription || `Mengenal ${orgName}`,
        }
    }
}

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch {
        return null
    }
}

export default async function AboutPage() {
    const profile = await getOrganizationProfile()

    // Parse mission if it's a numbered list
    const missionItems = profile?.mission?.split('\n').filter((item: string) => item.trim()) || []

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start">
                        <Badge variant="secondary" className="font-bold tracking-widest uppercase text-xs md:text-sm mb-4">Tentang Kami</Badge>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 leading-tight">Mengenal Lebih Dekat <br className="hidden md:block" /><span >BEM Pesantren Indonesia</span></h1>
                        <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-lg mb-8 font-light">
                            {profile?.shortDescription || "Organisasi mahasiswa santri Indonesia yang bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan mahasiswa pesantren di seluruh nusantara."}
                        </p>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="relative aspect-video bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                            {/* Placeholder for About us Video/Image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-serif text-2xl opacity-50">BEM Pesantren Indonesia Profile Video</span>
                            </div>
                        </div>
                        {/* Decorative */}
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-50"></div>
                    </div>
                </div>
            </section>

            {/* Vision Mission */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-4 md:mb-6 text-center md:text-left">Visi & Misi</h2>
                            <p className="text-lg md:text-xl mb-6 md:mb-8 leading-relaxed text-center md:text-left">
                                {profile?.vision || "Terwujudnya organisasi mahasiswa santri yang bertaqwa, berilmu, berakhlaqul karimah, dapat mempertanggungjawabkan keilmuannya serta cinta Islam dan tanah air."}
                            </p>

                            <div className="space-y-4 md:space-y-6">
                                {missionItems.length > 0 ? (
                                    missionItems.map((item: string, index: number) => {
                                        const icons = [ShieldCheck, Globe2, HeartHandshake]
                                        const Icon = icons[index % icons.length]
                                        const cleanItem = item.replace(/^\d+\.\s*/, '')

                                        return (
                                            <Card key={index} className="bg-transparent shadow-none border-none">
                                                <CardContent className="flex gap-4 p-0">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="">{cleanItem}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })
                                ) : (
                                    <>
                                        <Card className="bg-transparent shadow-none border-none">
                                            <CardContent className="flex gap-4 p-0">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold font-serif text-primary mb-2">Menjaga Tradisi</h3>
                                                    <p className="">Menghidupkan dan meramaikan eksistensi mahasiswa santri dalam ranah lokal, regional maupun nasional.</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-transparent shadow-none border-none">
                                            <CardContent className="flex gap-4 p-0">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                    <Globe2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold font-serif text-primary mb-2">Merawat Kebangsaan</h3>
                                                    <p className="">Menjalin rasa persahabatan mahasiswa santri se-Indonesia dan memperjuangkan kepentingan bersama.</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-transparent shadow-none border-none">
                                            <CardContent className="flex gap-4 p-0">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                    <HeartHandshake className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold font-serif text-primary mb-2">Pemberdayaan Ekonomi</h3>
                                                    <p className="">Menjalin kerjasama antar mahasiswa santri, masyarakat, dan pemerintah guna memajukan pesantren di bawah perguruan tinggi di Indonesia.</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="relative h-full min-h-[500px] bg-muted rounded-3xl overflow-hidden">
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary/30 text-4xl font-serif font-bold">
                                Foto Kegiatan
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History/Timeline (Simplified) */}
            <section className="py-16 md:py-24 bg-muted/20">
                <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-4 md:mb-6">Sejarah Singkat</h2>
                    <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                        {profile?.history || "BEM Pesantren Indonesia adalah organisasi mahasiswa santri yang lahir dari kebutuhan untuk menghidupkan eksistensi mahasiswa santri dalam ranah lokal, regional maupun nasional.\n\nOrganisasi ini bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan mahasiswa pesantren di seluruh nusantara, dengan komitmen untuk melestarikan tradisi pesantren sekaligus kearifan lokalnya."}
                    </p>
                </div>
            </section>

            {/* Program Kerja */}
            <section className="py-16 md:py-24 bg-background" id="program-kerja">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="font-bold tracking-widest uppercase text-xs mb-4">Agenda Perjuangan</Badge>
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-4">Program Kerja Unggulan</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Berbagai program kerja yang kami jalankan untuk mewujudkan visi dan misi organisasi.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: "Aksi & Advokasi Kebijakan", desc: "Turun ke jalan dan audiensi ke lembaga pemerintah memperjuangkan kepentingan santri dan pesantren." },
                            { title: "Kajian Ilmiah & Diskusi Publik", desc: "Menyelenggarakan forum diskusi, bedah buku, dan kajian tematik untuk meningkatkan kapasitas intelektual anggota." },
                            { title: "Silatnas & Konsolidasi Nasional", desc: "Mempererat tali persaudaraan mahasiswa santri se-Indonesia melalui pertemuan nasional rutin." },
                            { title: "Pengabdian Masyarakat", desc: "Program sosial kemasyarakatan berbasis pesantren untuk memberdayakan komunitas lokal." },
                            { title: "Penguatan Digital & Media", desc: "Membangun narasi positif tentang pesantren dan santri di ruang digital." },
                            { title: "Beasiswa & Pemberdayaan Ekonomi", desc: "Menginisiasi program beasiswa dan kewirausahaan mahasiswa santri." },
                        ].map((item, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-primary font-bold font-serif text-lg">{index + 1}</span>
                                    </div>
                                    <h3 className="font-bold font-serif text-base mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-background text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-xl md:text-3xl font-serif font-bold text-primary mb-4 md:mb-6">Ingin Berkolaborasi?</h2>
                    <p className=" mb-6 md:mb-8 text-base md:text-lg">Kami terbuka untuk sinergi dengan berbagai pihak demi kemaslahatan umat.</p>
                    <Link href="/contact">
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Hubungi Sekretariat Pusat
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

