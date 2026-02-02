"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { name: "Beranda", href: "/" },
        { name: "Tentang Kami", href: "/about" },
        { name: "Agenda", href: "/agenda" },
        { name: "Berita", href: "/news" },
        { name: "Galeri", href: "/gallery" },
        { name: "Hubungi Kami", href: "/contact" },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2 border-b border-border/50 text-foreground" : "bg-transparent py-6 text-white"}`}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="font-serif font-bold text-2xl flex items-center gap-2 group">
                            <span className={`flex items-center justify-center w-10 h-10 rounded-lg text-lg font-bold transition-colors ${scrolled ? "bg-primary text-white" : "bg-white text-primary"}`}>
                                F
                            </span>
                            <span className="tracking-tight group-hover:opacity-80 transition-opacity">FK3i</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium tracking-wide hover:text-secondary transition-colors uppercase ${scrolled ? "text-primary" : "text-white/90 hover:text-white"}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md focus:outline-none ${scrolled ? "text-primary hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-t">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-3 rounded-lg hover:bg-muted text-base font-medium text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
