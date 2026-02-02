import { Button } from "@/components/ui/button"
import { Globe2, HeartHandshake, ShieldCheck } from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch (e) {
        return null
    }
}

export default async function AboutPage() {
    const profile = await getOrganizationProfile()

    // Parse mission if it's a numbered list
    const missionItems = profile?.mission?.split('\n').filter(item => item.trim()) || []

    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Header */}
            <section className="bg-primary text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Tentang Kami</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">Mengenal Lebih Dekat <span className="text-secondary">FK3i</span></h1>
                        <p className="text-xl opacity-80 leading-relaxed max-w-lg mb-8 font-light">
                            {profile?.shortDescription || "Wadah silaturahmi kyai kampung yang bergerak dalam penguatan dakwah, pendidikan, dan ekonomi umat di akar rumput."}
                        </p>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="relative aspect-video bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                            {/* Placeholder for About us Video/Image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-serif text-2xl opacity-50">FK3i Profile Video</span>
                            </div>
                        </div>
                        {/* Decorative */}
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-50"></div>
                    </div>
                </div>
            </section>

            {/* Vision Mission */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Visi & Misi</h2>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                {profile?.vision || "Menjadi lokomotif pergerakan kyai kampung dalam mewujudkan tatanan masyarakat yang religius, moderat, dan sejahtera dalam bingkai NKRI."}
                            </p>

                            <div className="space-y-6">
                                {missionItems.length > 0 ? (
                                    missionItems.map((item, index) => {
                                        const icons = [ShieldCheck, Globe2, HeartHandshake]
                                        const Icon = icons[index % icons.length]
                                        const cleanItem = item.replace(/^\d+\.\s*/, '')

                                        return (
                                            <div key={index} className="flex gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">{cleanItem}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold font-serif text-primary mb-2">Menjaga Tradisi</h3>
                                                <p className="text-muted-foreground">Melestarikan ajaran Islam Ahlussunnah wal Jamaah An-Nahdliyah dan kearifan lokal.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                <Globe2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold font-serif text-primary mb-2">Merawat Kebangsaan</h3>
                                                <p className="text-muted-foreground">Mengukuhkan komitmen kebangsaan dan cinta tanah air sebagai bagian dari iman.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                <HeartHandshake className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold font-serif text-primary mb-2">Pemberdayaan Ekonomi</h3>
                                                <p className="text-muted-foreground">Membangun kemandirian ekonomi kyai dan pesantren melalui kewirausahaan sosial.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="relative h-full min-h-[500px] bg-gray-100 rounded-3xl overflow-hidden">
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary/30 text-4xl font-serif font-bold">
                                Foto Kegiatan
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History/Timeline (Simplified) */}
            <section className="py-24 bg-muted/20">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-4xl font-serif font-bold text-primary mb-6">Sejarah Singkat</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                        {profile?.history || "Bermula dari kegelisahan para kyai di pelosok desa yang merasakan perlunya wadah komunikasi untuk merespons tantangan zaman, Forum Kyai Kampung Indonesia lahir. Bukan dari istana, melainkan dari surau-surau kecil yang tak pernah lelah mengumandangkan adzan dan mengajarkan alif-ba-ta.\n\nKini, FK3i telah tumbuh menjadi kekuatan moral yang diperhitungkan, dengan ribuan anggota yang tersebar di seluruh provinsi, terus berkhidmat tanpa pamrih untuk agama dan bangsa."}
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-6">Ingin Berkolaborasi?</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Kami terbuka untuk sinergi dengan berbagai pihak demi kemaslahatan umat.</p>
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
