import prisma from "@/lib/prisma"
import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ContactForm } from "@/components/contact-form"
import { MessageSquare, Phone, Mail, FileText, ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: 'Pusat Aspirasi & Pengaduan | BEM Pesantren Indonesia',
    description: 'Sampaikan aspirasi, pengaduan isu, atau usulan kajian kebijakan kepada BEM Pesantren Indonesia.',
}

async function getProfile() {
    try {
        return await prisma.organizationProfile.findUnique({ where: { id: "default" } })
    } catch { return null }
}

async function getMessageCategories() {
    try {
        return await prisma.messageCategory.findMany({
            where: { published: true },
            orderBy: { order: 'asc' },
            select: { id: true, name: true }
        })
    } catch { return [] }
}

const QUICK_CHANNELS = [
    {
        title: "Laporkan Isu Kebijakan",
        desc: "Ada kebijakan kampus atau pemerintah yang merugikan santri? Laporkan ke kami.",
        action: "Kirim Laporan",
    },
    {
        title: "Usulkan Kajian",
        desc: "Punya ide topik kajian isu nasional yang relevan? Kami tampung sebagai agenda riset BEM.",
        action: "Usulkan Sekarang",
    },
    {
        title: "Undang Kolaborasi",
        desc: "Ingin mengundang BEM Pesantren Indonesia untuk berkolaborasi dalam kegiatan atau aksi?",
        action: "Buat Undangan",
    },
]

export default async function ContactPage() {
    const profile = await getProfile()
    const categories = await getMessageCategories()

    const waNumber = profile?.whatsapp || "6281234567890"
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent("Assalamualaikum, saya ingin menyampaikan aspirasi kepada BEM Pesantren Indonesia.")}`

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Hero */}
            <div className="bg-background border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="container mx-auto px-6 relative z-10">
                    <Badge variant="outline" className="font-bold tracking-widest uppercase text-xs mb-4 max-w-max mx-auto block">
                        Saluran Aspirasi Resmi
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4">
                        Pusat Aspirasi <br className="hidden md:block" />& Pengaduan
                    </h1>
                    <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground font-light">
                        Sampaikan isu kebijakan, usulkan kajian, atau ajak BEM Pesantren Indonesia berkolaborasi dalam pergerakan Anda.
                    </p>

                    {/* WhatsApp CTA */}
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex items-center gap-2 bg-foreground text-background font-bold px-6 py-3 rounded-full text-sm transition-opacity hover:opacity-80"
                    >
                        <Phone className="w-4 h-4" /> Hubungi via WhatsApp Langsung
                    </a>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mt-10 space-y-12">

                {/* Quick Channels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {QUICK_CHANNELS.map((ch) => (
                        <a
                            key={ch.title}
                            href="#form-aspirasi"
                            className="block group"
                        >
                            <Card className="border-border h-full hover:border-foreground/30 hover:shadow-md transition-all duration-200">
                                <CardContent className="p-5 flex flex-col gap-3 h-full">
                                    <h3 className="font-serif font-bold text-base group-hover:text-primary transition-colors">
                                        {ch.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                        {ch.desc}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold">
                                        {ch.action} <ArrowRight className="w-3 h-3" />
                                    </span>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>

                <Separator />

                {/* Form Aspirasi + Info Panel */}
                <div id="form-aspirasi" className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Info Panel */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-lg font-serif font-bold">Saluran Lainnya</h2>

                        {profile?.address && (
                            <Card className="border-border">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Alamat Pusat</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            {profile.address}{profile.city && `, ${profile.city}`}{profile.province && `, ${profile.province}`}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {profile?.email && (
                            <Card className="border-border">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Email Resmi</p>
                                        <a
                                            href={`mailto:${profile.email}`}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors break-all"
                                        >
                                            {profile.email}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-border">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">WhatsApp</p>
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                                    >
                                        Chat langsung →
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Repositori Dokumen</p>
                                    <p className="text-xs text-muted-foreground mb-2">Unduh AD/ART, GBHO, dan dokumen resmi.</p>
                                    <Link href="/documents">
                                        <Button size="sm" variant="outline" className="text-xs h-7">
                                            Buka Repositori →
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Card */}
                    <div className="lg:col-span-2">
                        <Card className="border-border shadow-sm">
                            <CardContent className="p-6 sm:p-8">
                                <h2 className="font-serif font-bold text-2xl mb-1">Kirim Aspirasi</h2>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Sampaikan isu, pengaduan, atau usulan secara tertulis. Tim kami akan menindaklanjuti setiap pesan yang masuk.
                                </p>
                                <ContactForm categories={categories} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
