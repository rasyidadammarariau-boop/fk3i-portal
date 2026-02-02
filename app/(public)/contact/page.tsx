import { Mail, MapPin, Phone } from "lucide-react"
import prisma from "@/lib/prisma"
import { ContactForm } from "@/components/contact-form"

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch (e) {
        return null
    }
}

async function getMessageCategories() {
    try {
        return await prisma.messageCategory.findMany({
            where: { published: true },
            orderBy: { order: 'asc' },
            select: { id: true, name: true }
        })
    } catch (e) {
        return []
    }
}

export default async function ContactPage() {
    const profile = await getOrganizationProfile()
    const categories = await getMessageCategories()

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-primary pt-32 pb-20 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_10s_ease-in-out_infinite]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Saluran Aspirasi</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Hubungi Kami</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto font-light">
                        Kami siap mendengar aspirasi, pertanyaan, atau undangan kegiatan dari Anda.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Address */}
                        {profile?.address && (
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                                <div className="min-w-12 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl mb-2 text-primary">Alamat Pusat</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {profile.address}<br />
                                        {profile.city && `${profile.city}, `}{profile.province}<br />
                                        {profile.postalCode}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        {profile?.email && (
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                                <div className="min-w-12 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl mb-2 text-primary">Email Resmi</h3>
                                    <p className="text-muted-foreground">
                                        {profile.email}<br />
                                        {profile.emailSecondary && profile.emailSecondary}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp */}
                        {profile?.whatsapp && (
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                                <div className="min-w-12 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl mb-2 text-primary">WhatsApp</h3>
                                    <p className="text-muted-foreground">
                                        <a href={`https://wa.me/${profile.whatsapp}`} className="hover:text-primary transition-colors">
                                            +{profile.whatsapp.replace(/^(\d{2})(\d+)/, '$1 $2')} (Admin)
                                        </a><br />
                                        {profile.whatsappSecondary && (
                                            <a href={`https://wa.me/${profile.whatsappSecondary}`} className="hover:text-primary transition-colors">
                                                +{profile.whatsappSecondary.replace(/^(\d{2})(\d+)/, '$1 $2')} (Humas)
                                            </a>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
                            <h2 className="font-serif font-bold text-3xl mb-2 text-gray-900">Kirim Pesan</h2>
                            <p className="text-muted-foreground mb-8">Silakan isi formulir di bawah ini untuk mengirimkan pesan langsung kepada kami.</p>

                            <ContactForm categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
