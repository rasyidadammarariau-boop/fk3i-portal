import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Header Section Skeleton */}
            <div className="bg-primary pt-32 pb-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex justify-center mb-6">
                        <Skeleton className="h-4 w-48 bg-white/20" />
                    </div>
                    <Skeleton className="h-4 w-32 mx-auto mb-4 bg-white/20" />
                    <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
                    <div className="flex items-center justify-center gap-4">
                        <Skeleton className="h-4 w-32 bg-white/20" />
                        <Skeleton className="h-1 w-1 rounded-full bg-white/20" />
                        <Skeleton className="h-4 w-24 bg-white/20" />
                    </div>
                </div>
            </div>

            {/* Content Section Skeleton */}
            <div className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                    {/* Album Cover Skeleton */}
                    <Skeleton className="aspect-video w-full mb-8 rounded-xl" />

                    {/* Description Skeleton */}
                    <div className="mb-12 max-w-3xl">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Photo Grid Skeleton */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <Skeleton className="h-8 w-64" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Back Button Skeleton */}
                    <div className="mt-12 text-center">
                        <Skeleton className="h-10 w-48 mx-auto rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
