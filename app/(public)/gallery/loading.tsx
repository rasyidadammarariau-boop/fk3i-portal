import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function GalleryLoading() {
    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Hero Skeleton */}
            <div className="border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center">
                <div className="container mx-auto px-6 flex flex-col items-center gap-3">
                    <Skeleton className="h-5 w-36 rounded-full" />
                    <Skeleton className="h-12 w-64 md:w-80" />
                    <Skeleton className="h-5 w-80 md:w-[480px]" />
                </div>
            </div>

            {/* Filter Tabs Skeleton */}
            <div className="container mx-auto px-6 mt-8 flex flex-wrap gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
            </div>

            {/* Grid Skeleton */}
            <div className="container mx-auto px-4 md:px-6 mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden border-border">
                            <Skeleton className="aspect-[16/10] w-full rounded-none" />
                            <CardContent className="p-5 space-y-2.5">
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
