import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Header Skeleton */}
            <div className="bg-primary/5 pt-32 pb-16 text-center">
                <div className="container mx-auto px-6 flex flex-col items-center gap-4">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-12 w-64 md:w-96" />
                    <Skeleton className="h-6 w-48 md:w-80" />
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20 mb-16">
                <Skeleton className="h-16 w-full max-w-3xl mx-auto rounded-xl" />
            </div>

            <div className="container mx-auto px-6 mt-16">
                {/* Featured Skeleton */}
                <div className="mb-16">
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
