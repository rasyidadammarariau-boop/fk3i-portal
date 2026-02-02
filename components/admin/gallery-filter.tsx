"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function GalleryFilter({ years }: { years: number[] }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const currentYear = searchParams.get('year') || "all"

    const handleYearChange = (year: string) => {
        const params = new URLSearchParams(searchParams)
        if (year && year !== "all") {
            params.set('year', year)
        } else {
            params.delete('year')
        }
        params.set('page', '1') // Reset page on filter change
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <Select value={currentYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-900">
                <SelectValue placeholder="Filter Tahun" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        Tahun {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
