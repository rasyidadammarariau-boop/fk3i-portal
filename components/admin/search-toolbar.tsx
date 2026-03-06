"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export function SearchToolbar({
    placeholder = "Cari...",
    children
}: {
    placeholder?: string,
    children?: React.ReactNode
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined)

    const handleSearch = (term: string) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            params.set('page', '1')
            if (term) {
                params.set('q', term)
            } else {
                params.delete('q')
            }
            replace(`${pathname}?${params.toString()}`)
        }, 300)
    }

    const isFiltered = searchParams.get('q') || searchParams.get('status') || searchParams.get('category')

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('q')
        params.delete('status')
        params.delete('category')
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-background p-4 rounded-lg border shadow-sm mb-6">
            <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 " />
                <Input
                    placeholder={placeholder}
                    className="pl-9 w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                    defaultValue={searchParams.get('q')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                {children}

                {isFiltered && (
                    <Button variant="ghost" onClick={clearFilters} className="h-8 px-2 lg:px-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}

