"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold font-serif  mb-3">Terjadi Kesalahan</h1>
                <p className=" mb-8">
                    Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang menangani masalah ini.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={reset} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/" className="gap-2 flex items-center">
                            <Home className="w-4 h-4" />
                            Beranda
                        </Link>
                    </Button>
                </div>
                {error.digest && (
                    <p className="text-xs  mt-6">Error ID: {error.digest}</p>
                )}
            </div>
        </div>
    )
}

