"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function StatusFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'all') {
            params.delete('status')
        } else {
            params.set('status', value)
        }
        params.set('page', '1') // Reset to page 1
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Select defaultValue={searchParams.get('status') || 'all'} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px]  dark:border-gray-600">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="published">Diterbitkan</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
        </Select>
    )
}

export function CategoryFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'all') {
            params.delete('category')
        } else {
            params.set('category', value)
        }
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    // Static categories for now, dynamic later
    const categories = ["Kegiatan", "Alam", "Edukasi", "Sosial"]

    return (
        <Select defaultValue={searchParams.get('category') || 'all'} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px]  dark:border-gray-600">
                <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

