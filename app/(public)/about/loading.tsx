import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="bg-background min-h-screen">
            {/* Header Skeleton */}
            <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="md:w-1/2 space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="md:w-1/2">
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                </div>
            </section>

            {/* Vision Mission Skeleton */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div className="space-y-8">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-32 w-full" />
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-6 w-32" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Skeleton className="h-[500px] w-full rounded-3xl" />
                    </div>
                </div>
            </section>
        </div>
    )
}

