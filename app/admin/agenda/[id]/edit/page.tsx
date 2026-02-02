import { updateAgenda } from "../../actions"
import { AgendaForm } from "@/components/admin/agenda-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const agenda = await prisma.agenda.findUnique({
        where: { id }
    })

    if (!agenda) {
        notFound()
    }

    const updateAgendaWithId = updateAgenda.bind(null, id)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/agenda" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Agenda</h1>
                    <p className="text-muted-foreground">Perbarui informasi kegiatan.</p>
                </div>
            </div>

            <AgendaForm
                action={updateAgendaWithId}
                initialData={{
                    title: agenda.title,
                    description: agenda.description,
                    date: agenda.date.toISOString(),
                    location: agenda.location,
                    image: agenda.image,
                    published: agenda.published
                }}
            />
        </div>
    )
}
