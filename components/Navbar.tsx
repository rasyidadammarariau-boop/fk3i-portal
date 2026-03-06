"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/toggle-theme"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Berita", href: "/news" },
    { name: "Arsip Pergerakan", href: "/gallery" },
    { name: "Dokumen", href: "/documents" },
    { name: "Hubungi Kami", href: "/contact" },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        // trigger initial check
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-background/95 backdrop-blur-md shadow-sm py-2 border-b border-border"
                    : "bg-background py-3 md:py-6"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="font-serif font-bold text-sm sm:text-base md:text-lg flex items-center gap-2 md:gap-3 group">
                        <Image
                            src="/logo.svg"
                            alt="Logo BEM Pesantren Indonesia"
                            width={40}
                            height={40}
                            className="rounded-lg transition-opacity group-hover:opacity-80 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 shrink-0"
                            priority
                        />
                        <span className="tracking-tight group-hover:opacity-80 transition-opacity max-w-[120px] sm:max-w-[180px] md:max-w-none truncate leading-tight">
                            BEM Pesantren Indonesia
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center space-x-5">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-xs font-bold tracking-wide hover:text-muted-foreground transition-colors uppercase"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        {/* Wrapper for ModeToggle to prevent layout shift */}
                        <div className="w-9 h-9">
                            {mounted && <ModeToggle />}
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    <div className="md:hidden flex items-center gap-1">
                        <div className="w-9 h-9">
                            {mounted && <ModeToggle />}
                        </div>
                        <div className="w-9 h-9 flex items-center justify-center">
                            {mounted ? (
                                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 focus:outline-none">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[280px] sm:w-[340px]">
                                        <SheetHeader>
                                            <SheetTitle className="text-left font-serif font-bold text-lg mb-4">
                                                Menu Navigasi
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="flex flex-col space-y-1 mt-2">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            ) : (
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
