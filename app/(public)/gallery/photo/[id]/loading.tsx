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
                    <Skeleton className="h-4 w-24 mx-auto mb-4 bg-white/20" />
                    <Skeleton className="h-12 w-80 mx-auto mb-4 bg-white/20" />
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
                    {/* Photo Display Skeleton */}
                    <Skeleton className="aspect-video w-full mb-8 rounded-xl" />

                    {/* Description Skeleton */}
                    <div className="mb-8 max-w-3xl mx-auto text-center">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full mx-auto" />
                            <Skeleton className="h-5 w-4/5 mx-auto" />
                        </div>
                    </div>

                    {/* Actions Skeleton */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                        <Skeleton className="h-10 w-56 rounded-md" />
                        <Skeleton className="h-10 w-48 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
