import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react"
import prisma from "@/lib/prisma"

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch (e) {
        return null
    }
}

export default async function Footer() {
    const profile = await getOrganizationProfile()

    return (
        <footer className="bg-primary text-white pt-20 pb-10 mt-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_10s_ease-in-out_infinite]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                F
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-xl leading-none">FK3i</h3>
                                <p className="text-secondary text-xs uppercase tracking-widest font-bold">Forum Kyai Kampung</p>
                            </div>
                        </div>
                        <p className="text-white/70 leading-relaxed font-light">
                            {profile?.shortDescription || "Wadah silaturahmi dan pergerakan kyai kampung dalam menjaga nilai-nilai keislaman, kebangsaan, dan pemberdayaan umat berbasis kearifan lokal."}
                        </p>
                        <div className="flex gap-4">
                            {profile?.facebook && (
                                <Link href={profile.facebook} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                    <Facebook className="w-5 h-5" />
                                </Link>
                            )}
                            {profile?.twitter && (
                                <Link href={profile.twitter} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                    <Twitter className="w-5 h-5" />
                                </Link>
                            )}
                            {profile?.instagram && (
                                <Link href={profile.instagram} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                            )}
                            {profile?.youtube && (
                                <Link href={profile.youtube} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                    <Youtube className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-6 text-secondary">Navigasi Utama</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Beranda</Link></li>
                            <li><Link href="/about" className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Tentang Kami</Link></li>
                            <li><Link href="/agenda" className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Agenda Kegiatan</Link></li>
                            <li><Link href="/news" className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Warta & Berita</Link></li>
                            <li><Link href="/gallery" className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Galeri Foto</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-6 text-secondary">Hubungi Kami</h4>
                        <ul className="space-y-6">
                            {profile?.address && (
                                <li className="flex gap-4 items-start">
                                    <MapPin className="w-6 h-6 text-secondary shrink-0" />
                                    <span className="text-white/70 text-sm leading-relaxed">
                                        {profile.address}, {profile.city}, {profile.province} {profile.postalCode}
                                    </span>
                                </li>
                            )}
                            {profile?.email && (
                                <li className="flex gap-4 items-start">
                                    <Mail className="w-5 h-5 text-secondary shrink-0" />
                                    <span className="text-white/70 text-sm">{profile.email}</span>
                                </li>
                            )}
                            {profile?.whatsapp && (
                                <li className="flex gap-4 items-start">
                                    <Phone className="w-5 h-5 text-secondary shrink-0" />
                                    <a href={`https://wa.me/${profile.whatsapp}`} className="text-white/70 text-sm hover:text-white transition-colors">
                                        +{profile.whatsapp.replace(/^(\d{2})(\d+)/, '$1 $2')}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Newsletter / Highlight */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-6 text-secondary">Bergabung Bersama Kami</h4>
                        <p className="text-white/70 mb-6 text-sm">
                            Dapatkan informasi terkini mengenai kegiatan dan dakwah FK3i langsung ke email Anda.
                        </p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email Anda" className="bg-white/10 border-none rounded-lg px-4 py-2 text-white placeholder:text-white/30 w-full focus:ring-1 focus:ring-secondary outline-none" />
                            <button className="bg-secondary text-primary font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors">
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} FK3i. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-white/40">
                        <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
