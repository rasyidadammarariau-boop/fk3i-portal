import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export const metadata = {
  title: "Login Admin | BEM Pesantren Indonesia",
  description: "Masuk ke dashboard admin BEM Pesantren Indonesia",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10 flex flex-col gap-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-primary/90 transition-colors">
              F
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight group-hover:opacity-80 transition-opacity">BEM Pesantren Indonesia</span>
          </Link>
        </div>
        <Suspense fallback={<div className="text-center text-sm  p-4">Memuat form login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

