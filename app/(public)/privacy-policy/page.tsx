import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Lock, Eye, MailCheck } from "lucide-react"

export const metadata: Metadata = {
    title: "Kebijakan Privasi | BEM Pesantren Indonesia",
    description: "Kebijakan Privasi dan Perlindungan Data pengguna BEM Pesantren Indonesia.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <section className="bg-primary/5 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Kebijakan Privasi</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Bagaimana BEM Pesantren Indonesia mengumpulkan, menggunakan, dan melindungi data pribadi Anda.
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-4">Pembaruan Terakhir: 1 Maret 2026</p>
                </div>
            </section>

            {/* Content using Shadcn UI Cards */}
            <section className="py-16 md:py-24 -mt-16 md:-mt-20 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl space-y-8">

                    {/* Intro Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <FileText className="w-4 h-4 mr-2" />
                                    1. Pendahuluan
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Kebijakan Privasi ini menjelaskan bagaimana <strong>Badan Eksekutif Mahasiswa (BEM) Pesantren Indonesia</strong> ("kami") mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi Anda saat Anda menggunakan situs web kami dan layanan terkait.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Kami berkomitmen kuat untuk melindungi privasi pengurus, anggota, anggota BEM wilayah, maupun masyarakat umum yang mendaftar atau mengakses portal ini.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Data Collection Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <Eye className="w-4 h-4 mr-2" />
                                    2. Informasi yang Kami Kumpulkan
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                                Saat Anda berinteraksi dengan portal resmi BEM Pesantren Indonesia, kami mungkin akan meminta dan menyimpan beberapa informasi berikut:
                            </p>
                            <ul className="space-y-4 text-muted-foreground text-lg ml-6 list-disc marker:text-primary">
                                <li>
                                    <strong className="text-foreground">Informasi Identitas Pribadi:</strong> Nama lengkap, asal instansi/kampus/pesantren, jabatan (jika ada), alamat email, nomor telepon/WhatsApp yang Anda berikan dalam formulir kontak atau pendaftaran.
                                </li>
                                <li>
                                    <strong className="text-foreground">Data Penggunaan dan Teknis:</strong> Alamat IP, jenis peramban (browser), waktu akses, halaman yang dikunjungi, dan data analitik dasar untuk meningkatkan pengalaman pengguna di portal kami.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Usage Card */}
                    <Card className="shadow-lg border-primary/10">
                        <CardContent className="p-8 md:p-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    <Shield className="w-4 h-4 mr-2" />
                                    3. Penggunaan & Keamanan Data
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                                Informasi yang kami kumpulkan digunakan secara internal untuk:
                            </p>
                            <ul className="space-y-4 text-muted-foreground text-lg ml-6 list-none">
                                <li className="flex gap-3"><span className="text-primary mt-1">✓</span> Memproses pertanyaan, laporan, atau kolaborasi yang dikirimkan.</li>
                                <li className="flex gap-3"><span className="text-primary mt-1">✓</span> Mengirimkan informasi terbaru dan pengumuman kegiatan.</li>
                                <li className="flex gap-3"><span className="text-primary mt-1">✓</span> Memperbaiki kualitas konten dan fungsi navigasi web.</li>
                                <li className="flex gap-3"><span className="text-primary mt-1">✓</span> Verifikasi keanggotaan wilayah dan administrasi organisasi.</li>
                            </ul>
                            <Separator className="my-6" />
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Kami <strong>tidak menjual, menyewakan, atau memperdagangkan</strong> informasi identitas pribadi Anda kepada pihak ketiga. Kami menggunakan pengamanan standar industri untuk memproteksi data Anda dari akses yang tidak sah.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contact Card */}
                    <Card className="bg-primary/5 border-primary/20 shadow-md">
                        <CardContent className="p-8 md:p-10 text-center space-y-4">
                            <MailCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-serif font-bold">Punya Pertanyaan?</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                Anda berhak untuk menanyakan, memperbarui, atau meminta penghapusan informasi pribadi Anda. Hubungi kami untuk bantuan lebih lanjut terkait privasi.
                            </p>
                            <div className="pt-4">
                                <a href="/contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2">
                                    Hubungi Kami
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
