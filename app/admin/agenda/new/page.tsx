import { createAgenda } from "../actions"
import { AgendaForm } from "@/components/admin/agenda-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewAgendaPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/agenda" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tambah Agenda Baru</h1>
                    <p className="text-muted-foreground">Buat jadwal kegiatan baru untuk ditampilkan.</p>
                </div>
            </div>

            <AgendaForm action={createAgenda} />
        </div>
    )
}
