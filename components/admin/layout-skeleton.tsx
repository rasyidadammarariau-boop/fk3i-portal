import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function AdminLayoutSkeleton() {
    return (
        <div className="flex min-h-screen  font-sans">
            {/* Sidebar Skeleton */}
            <div className="w-64  h-screen hidden md:flex flex-col border-r border-slate-800">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full " />
                        <Skeleton className="h-6 w-32 " />
                    </div>
                </div>
                <Separator className="" />
                <div className="p-4 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full /50" />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                {/* Header Skeleton */}
                <header className="h-16 border-b  dark:border-gray-700 flex items-center justify-between px-6">
                    <Skeleton className="h-4 w-[200px] hidden md:block" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1 hidden md:block">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-2 w-16" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Skeleton */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-xl" />
                            ))}
                        </div>
                        <Skeleton className="h-[400px] rounded-xl" />
                    </div>
                </main>
            </div>
        </div>
    )
}

