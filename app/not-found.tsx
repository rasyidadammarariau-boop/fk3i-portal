import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-primary flex items-center justify-center px-6">
            <div className="text-center text-white max-w-md">
                <div className="text-8xl font-serif font-bold opacity-20 mb-4">404</div>
                <h1 className="text-3xl font-serif font-bold mb-3">Halaman Tidak Ditemukan</h1>
                <p className="opacity-70 mb-8 text-lg">
                    Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-none hover:bg-secondary hover:text-white transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Beranda
                    </Link>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/50 text-white font-medium rounded-none hover:bg-white/10 transition-colors"
                    >
                        Baca Berita
                    </Link>
                </div>
            </div>
        </div>
    )
}

