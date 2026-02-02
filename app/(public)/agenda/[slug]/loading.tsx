import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            <div className="bg-primary/5 py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex items-center gap-2 mb-8 text-muted-foreground opacity-50">
                        <ArrowLeft className="h-4 w-4" /> <span className="text-sm font-bold uppercase tracking-widest">KEMBALI KE JADWAL</span>
                    </div>
                    <Skeleton className="h-12 w-3/4 mb-6" />
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl -mt-10">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[400px]">
                    <div className="md:w-1/3 bg-gray-100 p-8 flex flex-col justify-center items-center gap-4">
                        <Skeleton className="h-16 w-16" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="p-12 md:w-2/3 space-y-6">
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-px w-full my-8" />
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    )
}
