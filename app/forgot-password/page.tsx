"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { requestPasswordReset } from "./actions"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)
        setError("")

        try {
            const result = await requestPasswordReset(email)
            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || "Terjadi kesalahan")
            }
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-sm text-muted-foreground">Kembali ke Login</span>
                    </div>
                    <CardTitle className="text-2xl font-bold font-serif">
                        {success ? "Email Terkirim!" : "Lupa Password?"}
                    </CardTitle>
                    <CardDescription>
                        {success
                            ? "Periksa email Anda untuk instruksi reset password."
                            : "Masukkan email terdaftar untuk mendapatkan link reset password."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="flex flex-col items-center gap-4 py-8 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Jika email <strong>{email}</strong> terdaftar, Anda akan menerima link reset password dalam beberapa menit.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Tidak menerima email? Periksa folder spam atau{" "}
                                <button
                                    onClick={() => { setSuccess(false); setEmail("") }}
                                    className="text-primary underline"
                                >
                                    coba lagi
                                </button>.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Admin</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@bem-pesantren.or.id"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Mengirim..." : "Kirim Link Reset"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
