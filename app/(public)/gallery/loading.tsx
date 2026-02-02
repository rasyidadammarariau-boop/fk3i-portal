import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            <div className="bg-primary/5 pt-32 pb-16 text-center">
                <div className="container mx-auto px-6 flex flex-col items-center gap-4">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-12 w-64 md:w-96" />
                    <Skeleton className="h-6 w-48 md:w-80" />
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-16 relative z-20">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
