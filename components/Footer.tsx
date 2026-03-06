import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react"
import prisma from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch {
        return null
    }
}

export default async function Footer() {
    const profile = await getOrganizationProfile()

    const socials = [
        { href: profile?.facebook, icon: Facebook, label: "Facebook" },
        { href: profile?.twitter, icon: Twitter, label: "Twitter" },
        { href: profile?.instagram, icon: Instagram, label: "Instagram" },
        { href: profile?.youtube, icon: Youtube, label: "YouTube" },
    ].filter(s => Boolean(s.href))

    return (
        <footer className="bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20">

                {/* Grid utama — 1 col mobile, 2 col tablet, 4 col desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">

                    {/* ── Brand Section ── */}
                    <div className="md:col-span-2 lg:col-span-1 space-y-4 md:space-y-5">
                        {/* Logo + nama */}
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <Image
                                src="/logo.svg"
                                alt="Logo BEM Pesantren Indonesia"
                                width={40}
                                height={40}
                                className="rounded-xl flex-shrink-0 transition-opacity group-hover:opacity-80 md:w-12 md:h-12"
                            />
                            <div className="leading-tight">
                                <p className="font-serif font-bold text-sm md:text-base leading-tight group-hover:opacity-80 transition-opacity">
                                    BEM Pesantren Indonesia
                                </p>
                                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                                    Mahasiswa Santri Indonesia
                                </p>
                            </div>
                        </Link>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {profile?.shortDescription ||
                                "Organisasi mahasiswa santri Indonesia yang bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan mahasiswa pesantren di seluruh nusantara."}
                        </p>

                        {/* Social links */}
                        {socials.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-1">
                                {socials.map(({ href, icon: Icon, label }) => (
                                    <Link
                                        key={label}
                                        href={href!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Kunjungi ${label} Kami`}
                                        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Grouping Navigasi & Hubungi Kami (kanan-kiri di mobile) ── */}
                    <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-2 md:gap-8 lg:gap-12">
                        {/* ── Navigasi Utama ── */}
                        <div>
                            <h4 className="font-serif font-bold text-base mb-5">Navigasi Utama</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {[
                                    { label: "Beranda", href: "/" },
                                    { label: "Tentang Kami", href: "/about" },
                                    { label: "Warta & Berita", href: "/news" },
                                    { label: "Galeri Foto", href: "/gallery" },
                                    { label: "Hubungi Kami", href: "/contact" },
                                ].map(({ label, href }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-1"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-primary/50 mr-1" />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Hubungi Kami ── */}
                        <div>
                            <h4 className="font-serif font-bold text-base mb-5">Hubungi Kami</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                {profile?.address && (
                                    <li className="flex gap-3 items-start">
                                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">
                                            {profile.address}
                                            {profile.city && `, ${profile.city}`}
                                            {profile.province && `, ${profile.province}`}
                                            {profile.postalCode && ` ${profile.postalCode}`}
                                        </span>
                                    </li>
                                )}
                                {profile?.email && (
                                    <li className="flex gap-3 items-center">
                                        <Mail className="w-4 h-4 text-primary shrink-0" />
                                        <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors break-all">
                                            {profile.email}
                                        </a>
                                    </li>
                                )}
                                {profile?.whatsapp && (
                                    <li className="flex gap-3 items-center">
                                        <Phone className="w-4 h-4 text-primary shrink-0" />
                                        <a
                                            href={`https://wa.me/${profile.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors"
                                        >
                                            +{profile.whatsapp.replace(/^(\d{2})(\d+)/, "$1 $2")}
                                        </a>
                                    </li>
                                )}
                                {!profile?.address && !profile?.email && !profile?.whatsapp && (
                                    <li className="text-muted-foreground/50 italic text-xs">Belum diatur</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* ── Newsletter ── */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h4 className="font-serif font-bold text-base mb-5">Bergabung Bersama Kami</h4>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Dapatkan informasi terkini kegiatan BEM Pesantren Indonesia langsung ke email Anda.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Email Anda..."
                                className="text-sm flex-1 min-w-0"
                            />
                            <Button
                                aria-label="Daftar Newsletter"
                                size="sm"
                                className="shrink-0 px-4 font-bold md:h-9"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 md:my-10" />

                {/* ── Bottom Bar ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-muted-foreground">
                    <p className="text-center md:text-left">
                        &copy; {new Date().getFullYear()} BEM Pesantren Indonesia. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Link href="/privacy-policy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
                        <Link href="/terms-of-service" className="hover:text-primary transition-colors">Syarat &amp; Ketentuan</Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}
