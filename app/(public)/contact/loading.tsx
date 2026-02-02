import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            {/* Hero Skeleton */}
            <div className="bg-primary/5 pt-32 pb-20 text-center">
                <div className="container mx-auto px-6 flex flex-col items-center gap-4">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-12 w-64 md:w-96" />
                    <Skeleton className="h-6 w-48 md:w-80" />
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                                <Skeleton className="min-w-12 w-12 h-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 space-y-8">
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-48" />
                                <Skeleton className="h-4 w-full" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <Skeleton className="h-12 w-48 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
