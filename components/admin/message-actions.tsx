'use client'

import { Button } from "@/components/ui/button"
import { updateMessageStatus, deleteMessage } from "@/app/admin/messages/actions"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

interface MessageActionsProps {
    messageId: string
    currentStatus: string
}

export function MessageActions({ messageId, currentStatus }: MessageActionsProps) {
    const handleStatusChange = async (newStatus: string) => {
        const result = await updateMessageStatus(messageId, newStatus)
        if (result.success) {
            toast.success('Status berhasil diupdate')
        } else {
            toast.error(result.error || 'Gagal mengupdate status')
        }
    }

    const handleDelete = async () => {
        if (!confirm('Hapus pesan ini?')) return

        const result = await deleteMessage(messageId)
        if (result.success) {
            toast.success('Pesan berhasil dihapus')
        } else {
            toast.error(result.error || 'Gagal menghapus pesan')
        }
    }

    return (
        <div className="flex items-center gap-2 mt-3">
            {currentStatus === 'new' && (
                <Button size="sm" variant="outline" onClick={() => handleStatusChange('read')}>
                    Tandai Dibaca
                </Button>
            )}
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
    )
}
