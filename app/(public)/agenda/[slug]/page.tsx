import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react"

async function getAgendaItem(slug: string) {
    try {
        return await prisma.agenda.findUnique({
            where: { slug }
        })
    } catch (e) {
        return null
    }
}

import { Breadcrumb } from "@/components/ui/breadcrumb-custom"

export default async function AgendaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const agenda = await getAgendaItem(slug)

    if (!agenda) {
        notFound()
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24 font-sans">
            <div className="bg-primary/5 py-12 md:py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Breadcrumb
                        items={[
                            { label: "Agenda", href: "/agenda" },
                            { label: agenda.title }
                        ]}
                    />
                    <Link href="/agenda" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Jadwal
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
                        {agenda.title}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl -mt-10">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-primary text-white p-8 flex flex-col justify-center items-center text-center">
                        <div className="text-6xl font-serif font-bold mb-2">{new Date(agenda.date).getDate()}</div>
                        <div className="text-xl tracking-widest uppercase font-medium">{new Date(agenda.date).toLocaleDateString('id-ID', { month: 'long' })}</div>
                        <div className="text-white/70 mt-2">{new Date(agenda.date).getFullYear()}</div>
                    </div>
                    <div className="p-8 md:p-12 md:w-2/3">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary flex-shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Waktu</h4>
                                    <p className="text-muted-foreground">08:00 WIB - Selesai</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Lokasi</h4>
                                    <p className="text-muted-foreground">{agenda.location}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="my-8 border-gray-100" />

                        <h3 className="font-serif font-bold text-xl text-primary mb-4">Deskripsi Kegiatan</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {agenda.description}
                        </p>

                        <div className="mt-8">
                            <Button className="w-full rounded-full font-bold">Konfirmasi Kehadiran</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
