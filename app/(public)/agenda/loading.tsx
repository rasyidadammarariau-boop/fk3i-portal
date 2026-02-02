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

            <div className="container mx-auto px-6 mt-16 max-w-5xl">
                <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 p-6 gap-6">
                            <Skeleton className="w-full md:w-48 h-32 rounded-xl" />
                            <div className="flex-1 flex flex-col justify-center gap-3">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
