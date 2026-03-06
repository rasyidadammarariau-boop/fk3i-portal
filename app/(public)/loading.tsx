import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="bg-background min-h-screen pb-12 md:pb-24">
            {/* Hero Skeleton */}
            <div className="h-[90vh] md:min-h-screen w-full bg-muted/20 animate-pulse relative pt-28 pb-12 md:py-0">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-6">
                        <Skeleton className="h-16 w-3/4 mb-6" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>
            </div>

            {/* Stats/Features Skeleton */}
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            </div>

            {/* News Grid Skeleton */}
            <div className="container mx-auto px-6 py-12">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid md:grid-cols-2 gap-12">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                    <div className="space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-24 w-32 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

