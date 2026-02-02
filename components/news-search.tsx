"use client"

import { Search } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback, useState } from "react"

// Simple debounce utility
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
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
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto flex gap-4 items-center">
            <Search className="text-muted-foreground w-5 h-5 ml-2" />
            <input
                type="text"
                placeholder="Cari berita..."
                className="flex-1 outline-none text-foreground placeholder:text-muted-foreground bg-transparent"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
            />
        </div>
    )
}
