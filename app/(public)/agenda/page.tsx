import prisma from "@/lib/prisma"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Jadwal Kegiatan',
    description: 'Kalender agenda dan kegiatan resmi FK3i di seluruh Indonesia.',
}

async function getAgendas() {
    try {
        return await prisma.agenda.findMany({
            orderBy: { date: 'asc' },
            where: {
                date: {
                    gte: new Date() // Only show upcoming
                }
            }
        })
    } catch (e) {
        return []
    }
}

export default async function AgendaPage() {
    const agendas = await getAgendas()

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Header */}
            <div className="bg-primary pt-32 pb-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[pulse_10s_ease-in-out_infinite]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Jadwal Kegiatan</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Agenda FK3i</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto font-light">Informasi kegiatan dan agenda resmi Forum Kyai Kampung Indonesia.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-5xl">
                {agendas.length > 0 ? (
                    <div className="grid gap-6">
                        {agendas.map((item) => (
                            <div key={item.id} className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden">
                                <div className="flex-shrink-0 w-full md:w-48 bg-primary/5 flex flex-col items-center justify-center p-6 border-r border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="text-4xl font-serif font-bold">{new Date(item.date).getDate()}</span>
                                    <span className="text-sm tracking-widest uppercase font-bold">{new Date(item.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                    <span className="text-xs opacity-70 mt-1">{new Date(item.date).getFullYear()}</span>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-center">
                                    <h3 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center text-sm text-gray-500 font-medium">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {item.location}
                                        </div>
                                        <Link href={`/agenda/${item.slug}`}>
                                            <Button variant="ghost" className="text-primary hover:text-secondary hover:bg-transparent p-0 flex items-center gap-2">
                                                Detail Agenda <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada agenda mendatang</h3>
                        <p className="text-muted-foreground">Pantau terus halaman ini untuk informasi kegiatan terbaru informasi terbaru.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button"
