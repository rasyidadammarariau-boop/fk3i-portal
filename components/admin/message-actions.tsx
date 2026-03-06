'use client'

import { Button } from "@/components/ui/button"
import { updateMessageStatus, deleteMessage, replyToMessage } from "@/app/admin/messages/actions"
import { toast } from "sonner"
import { Trash2, Reply, Send, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface MessageActionsProps {
    messageId: string
    currentStatus: string
    recipientName: string
    recipientEmail: string
    subject: string
}

export function MessageActions({ messageId, currentStatus, recipientName, recipientEmail, subject }: MessageActionsProps) {
    const [replyDialogOpen, setReplyDialogOpen] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [isSending, setIsSending] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        const result = await updateMessageStatus(messageId, newStatus)
        if (result.success) {
            toast.success('Status berhasil diupdate')
        } else {
            toast.error((result as { error?: string }).error || 'Gagal mengupdate status')
        }
    }

    const handleDelete = async () => {
        if (!confirm('Hapus pesan ini?')) return

        const result = await deleteMessage(messageId)
        if (result.success) {
            toast.success('Pesan berhasil dihapus')
        } else {
            toast.error((result as { error?: string }).error || 'Gagal menghapus pesan')
        }
    }

    const handleReply = async () => {
        if (!replyText.trim()) {
            toast.error('Isi balasan tidak boleh kosong')
            return
        }

        setIsSending(true)
        const result = await replyToMessage(messageId, replyText)
        setIsSending(false)

        if (result.success) {
            toast.success('Balasan berhasil dikirim ke ' + recipientEmail)
            setReplyDialogOpen(false)
            setReplyText("")
        } else {
            toast.error((result as { error?: string }).error || 'Gagal mengirim balasan')
        }
    }

    return (
        <>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
                {currentStatus === 'new' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange('read')}>
                        Tandai Dibaca
                    </Button>
                )}
                <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5  border-border hover:bg-secondary"
                    onClick={() => setReplyDialogOpen(true)}
                >
                    <Reply className="w-3.5 h-3.5" />
                    Balas
                </Button>
                {currentStatus === 'read' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange('replied')}>
                        Tandai Dibalas
                    </Button>
                )}
                {currentStatus !== 'archived' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange('archived')}>
                        Arsipkan
                    </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Reply className="w-4 h-4" />
                            Balas ke {recipientName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="text-sm  bg-muted/50 rounded p-3">
                            <span className="font-medium">Ke:</span> {recipientEmail}<br />
                            <span className="font-medium">Perihal:</span> Re: {subject}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Isi Balasan</Label>
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Yth. ${recipientName},\n\nTerima kasih telah menghubungi BEM Pesantren Indonesia...`}
                                className="min-h-[160px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setReplyDialogOpen(false)} disabled={isSending}>
                            Batal
                        </Button>
                        <Button onClick={handleReply} disabled={isSending} className="gap-2">
                            {isSending ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                            ) : (
                                <><Send className="w-4 h-4" /> Kirim Balasan</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


