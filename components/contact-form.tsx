'use client'

import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { submitContactMessage } from "@/app/(public)/contact/actions"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button disabled={pending} className="gap-2">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {pending ? "Mengirim..." : "Kirim Aspirasi"}
        </Button>
    )
}

interface ContactFormProps {
    categories: { id: string; name: string }[]
}

export function ContactForm({ categories }: ContactFormProps) {
    const [state, formAction] = useActionState(submitContactMessage, null)
    const [categoryId, setCategoryId] = useState('')

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message)
            const form = document.getElementById('contact-form') as HTMLFormElement
            form?.reset()
            setCategoryId('')
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form id="contact-form" action={formAction} className="space-y-5">
            {/* Hidden input for category (controlled via Shadcn Select) */}
            <input type="hidden" name="categoryId" value={categoryId} />

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Nama Lengkap <span className="text-muted-foreground">*</span></Label>
                    <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Nama Anda"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Alamat Email <span className="text-muted-foreground">*</span></Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="email@contoh.com"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor WhatsApp <span className="text-xs text-muted-foreground">(opsional)</span></Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+62 812-3456-7890"
                />
            </div>

            {categories.length > 0 && (
                <div className="space-y-1.5">
                    <Label>Jenis Aspirasi <span className="text-muted-foreground">*</span></Label>
                    <Select value={categoryId} onValueChange={setCategoryId} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis aspirasi..." />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="space-y-1.5">
                <Label htmlFor="subject">Perihal <span className="text-muted-foreground">*</span></Label>
                <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Judul singkat aspirasi Anda"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="message">Isi Aspirasi <span className="text-muted-foreground">*</span></Label>
                <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="resize-y min-h-[120px]"
                    placeholder="Tuliskan isu, usulan, atau pesan Anda secara detail. Sertakan konteks yang relevan agar kami bisa menindaklanjuti dengan tepat..."
                />
            </div>

            <SubmitButton />
        </form>
    )
}
