import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, User, MessageSquare } from "lucide-react"
import { MessageActions } from "@/components/admin/message-actions"

async function getMessages() {
    try {
        return await prisma.contactMessage.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        })
    } catch (e) {
        return []
    }
}

async function getStats() {
    try {
        const total = await prisma.contactMessage.count()
        const newCount = await prisma.contactMessage.count({ where: { status: 'new' } })
        const readCount = await prisma.contactMessage.count({ where: { status: 'read' } })
        const repliedCount = await prisma.contactMessage.count({ where: { status: 'replied' } })

        return { total, new: newCount, read: readCount, replied: repliedCount }
    } catch (e) {
        return { total: 0, new: 0, read: 0, replied: 0 }
    }
}

function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; label: string }> = {
        new: { variant: "default", label: "Baru" },
        read: { variant: "secondary", label: "Dibaca" },
        replied: { variant: "outline", label: "Dibalas" },
        archived: { variant: "outline", label: "Arsip" }
    }

    const config = variants[status] || variants.new
    return <Badge variant={config.variant}>{config.label}</Badge>
}

export default async function MessagesPage() {
    const messages = await getMessages()
    const stats = await getStats()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Pesan Masuk</h1>
                <p className="text-muted-foreground">Kelola pesan dari pengunjung website</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Pesan</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Pesan Baru</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">{stats.new}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Sudah Dibaca</CardDescription>
                        <CardTitle className="text-3xl text-gray-600">{stats.read}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Sudah Dibalas</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{stats.replied}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Messages List */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pesan</CardTitle>
                    <CardDescription>Klik pesan untuk melihat detail</CardDescription>
                </CardHeader>
                <CardContent>
                    {messages.length > 0 ? (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg">{message.name}</h3>
                                                {getStatusBadge(message.status)}
                                                {message.category && (
                                                    <Badge variant="outline">{message.category.name}</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                <strong>Perihal:</strong> {message.subject}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground text-right">
                                            {new Date(message.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {message.email}
                                        </div>
                                        {message.phone && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {message.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded p-3 text-sm">
                                        <p className="line-clamp-2">{message.message}</p>
                                    </div>

                                    {message.adminNotes && (
                                        <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 text-sm">
                                            <p className="font-semibold text-blue-900 mb-1">Catatan Admin:</p>
                                            <p className="text-blue-800">{message.adminNotes}</p>
                                        </div>
                                    )}

                                    <MessageActions messageId={message.id} currentStatus={message.status} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada pesan masuk</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
