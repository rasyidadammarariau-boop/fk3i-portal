import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function DocumentsLoading() {
    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Hero Skeleton */}
            <div className="border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center">
                <div className="container mx-auto px-6 flex flex-col items-center gap-3">
                    <Skeleton className="h-5 w-36 rounded-full" />
                    <Skeleton className="h-12 w-64 md:w-80" />
                    <Skeleton className="h-5 w-80 md:w-[500px]" />
                </div>
            </div>

            {/* Filter Tabs Skeleton */}
            <div className="container mx-auto px-6 mt-8 flex flex-wrap gap-2 justify-center">
                {["Semua", "AD/ART", "GBHO", "SK", "SOP", "Surat", "Umum"].map((label) => (
                    <Skeleton key={label} className="h-8 w-20 rounded-full" />
                ))}
            </div>

            {/* Count + Separator */}
            <div className="container mx-auto px-4 md:px-6 mt-8">
                <Skeleton className="h-4 w-44" />
                <Separator className="mt-3" />
            </div>

            {/* Grid Skeleton */}
            <div className="container mx-auto px-4 md:px-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="border-border">
                            <CardContent className="p-5 flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-20 rounded-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex gap-3">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-10" />
                                    </div>
                                    <Skeleton className="h-7 w-16 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
