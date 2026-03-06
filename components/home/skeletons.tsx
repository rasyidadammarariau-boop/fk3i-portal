import { Skeleton } from "@/components/ui/skeleton"

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x divide-white/10">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center px-0 md:px-4 flex flex-col items-center">
                    <Skeleton className="h-10 w-24 mb-2 bg-white/20" />
                    <Skeleton className="h-4 w-32 bg-white/20" />
                </div>
            ))}
        </div>
    )
}

export function NewsSkeleton() {
    return (
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-pulse">
            <div className="h-full mb-8 lg:mb-0">
                <Skeleton className="w-full aspect-[16/9] lg:h-[400px] rounded-lg lg:rounded-none" />
            </div>
            <div className="flex flex-col gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 md:gap-6 items-start border-b border-gray-200/50 pb-6 md:pb-8 last:border-0 last:pb-0">
                        <Skeleton className="w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-32 rounded lg:rounded-none shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-2/3 hidden sm:block" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                    key={i}
                    className={`bg-gray-200 rounded-lg md:rounded-none ${i === 1 ? "sm:col-span-2 md:col-span-2 md:row-span-2" : "md:col-span-1"}`}
                />
            ))}
        </div>
    )
}


