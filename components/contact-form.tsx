'use client'

import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitContactMessage } from "@/app/(public)/contact/actions"
import { useEffect } from "react"
import { toast } from "sonner"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button disabled={pending} className="w-full md:w-auto px-8 h-12 text-base font-bold rounded-full gap-2">
            <Send className="w-4 h-4" /> {pending ? "Mengirim..." : "Kirim Pesan"}
        </Button>
    )
}

interface ContactFormProps {
    categories: { id: string; name: string }[]
}

export function ContactForm({ categories }: ContactFormProps) {
    const [state, formAction] = useActionState(submitContactMessage, null)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message)
            // Reset form
            const form = document.getElementById('contact-form') as HTMLFormElement
            form?.reset()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form id="contact-form" action={formAction} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-gray-700">Nama Lengkap *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Nama Anda"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-700">Alamat Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="email@contoh.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold text-gray-700">Nomor Telepon / WhatsApp</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="+62 812-3456-7890"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="categoryId" className="text-sm font-bold text-gray-700">Kategori Pesan *</label>
                <select
                    id="categoryId"
                    name="categoryId"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                    <option value="">Pilih Kategori Pesan</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-gray-700">Perihal *</label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Judul pesan Anda"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-gray-700">Pesan *</label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Tuliskan pesan Anda secara detail..."
                />
            </div>

            <SubmitButton />
        </form>
    )
}
