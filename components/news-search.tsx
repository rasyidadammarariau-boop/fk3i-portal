"use client"

import { Search } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Simple debounce utility
function useDebounce<Args extends unknown[]>(callback: (...args: Args) => void, delay: number) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: Args) => {
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            callback(...args);
        }, delay);
        setTimer(newTimer);
    }, [callback, delay, timer]);
}

export function NewsSearch() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebounce((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1') // Reset to page 1 on search
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <Card className="rounded-xl shadow-lg border-gray-100 max-w-3xl mx-auto overflow-hidden">
            <CardContent className="p-2 flex gap-2 items-center">
                <Search className=" w-5 h-5 ml-2" />
                <Input
                    type="text"
                    placeholder="Cari berita..."
                    className="flex-1 border-none shadow-none focus-visible:ring-0 px-2"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('q')?.toString()}
                />
            </CardContent>
        </Card>
    )
}

