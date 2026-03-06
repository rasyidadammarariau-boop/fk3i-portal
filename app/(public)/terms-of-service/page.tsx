import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, ShieldAlert, Link as LinkIcon, Edit } from "lucide-react"

export const metadata: Metadata = {
    title: "Syarat & Ketentuan | BEM Pesantren Indonesia",
    description: "Syarat dan Ketentuan penggunaan layanan portal BEM Pesantren Indonesia.",
}

export default function TermsOfServicePage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <section className="bg-primary/5 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Syarat & Ketentuan</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Aturan dan pedoman dalam menggunakan portal resmi BEM Pesantren Indonesia.
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-4">Pembaruan Terakhir: 1 Maret 2026</p>
                </div>
            </section>

            {/* Content with Shadcn UI Cards */}
            <section className="py-16 md:py-24 -mt-16 md:-mt-20 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl space-y-8">

                    {/* Intro Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <Scale className="w-4 h-4 mr-2" />
                                    1. Penerimaan Syarat
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Dengan mengakses dan menggunakan situs web BEM Pesantren Indonesia, Anda menerima dan setuju untuk terikat dan mematuhi Ketentuan Layanan (Terms of Service) ini. Jika Anda tidak menyetujui salah satu syarat dan ketentuan ini, mohon untuk tidak menggunakan situs web ini.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Prohibited Behavior Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                    2. Penggunaan Portal yang Dilarang
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                                Anda setuju untuk tidak melakukan tindakan perilaku yang dilarang saat menggunakan situs kami, yang mencakup namun tidak terbatas pada:
                            </p>
                            <ul className="space-y-4 text-muted-foreground text-lg ml-6 list-disc marker:text-destructive">
                                <li>Menyebarkan atau mengirimkan materi yang menyinggung, melecehkan, memfitnah, atau tindakan lain yang dapat dibaca sebagai kebencian antar golongan.</li>
                                <li>Mengganggu sistem operasional, seperti melakukan tindakan eksploitasi peretasan (hacking), penyebaran malware, spam, atau serangan siber.</li>
                                <li>Mengklaim sebagai pimpinan otoritas atau anggota pengurus nasional secara sewenang-wenang tanpa mandat/sepengetahuan organisasi.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Copyright Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <Edit className="w-4 h-4 mr-2" />
                                    3. Hak Kekayaan Intelektual
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Seluruh aset tata letak (desain), warta berita resmi, gambar dokumentasi kegiatan, dan logo badan pelaksana yang dimuat dalam sistem adalah milik BEM Pesantren Indonesia.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Pengguna (baik anggota maupun jurnalis eksekutif) diizinkan penuh untuk mengutip teks siaran pers, artikel kegiatan, atau membagikan bahan publikasi asalkan wajib menyertakan tautan balik (<i>link back</i>) ke portal resmi kami.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Third Party Links Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    4. Tautan Web Pihak Ketiga & Pembaruan
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                                Situs web maupun bagian rubrik berita kami mungkin seringkali menyertakan tautan logikal (eksternal URL) menuju situs yang bukan dioperasikan oleh kami secara mandiri. Kami tidak memiliki kendali yuridis atas isi konten situs pihak ketiga mana pun dan tidak bertanggung jawab atas kebijakan privasinya.
                            </p>
                            <Separator className="my-6" />
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Pembaharuan Syarat: Kami menetapkan hak administratif penuh untuk merombak seluruh Syarat dan Layanan ini sewaktu-waktu. Penggunaan Anda yang berkelanjutan memposisikan komitmen ketaatan legal hukum atas regulasi yang aktif dalam halaman ini.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
