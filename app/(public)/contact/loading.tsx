import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactLoading() {
    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Hero Skeleton */}
            <div className="border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 text-center">
                <div className="container mx-auto px-6 flex flex-col items-center gap-4">
                    <Skeleton className="h-5 w-36 rounded-full" />
                    <Skeleton className="h-12 w-72 md:w-[500px]" />
                    <Skeleton className="h-5 w-56 md:w-96" />
                    <Skeleton className="h-11 w-56 rounded-full mt-2" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mt-10 space-y-12">
                {/* Quick Channels Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-border">
                            <CardContent className="p-5 space-y-3">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Form + Info Skeleton */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Info Cards */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-36" />
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-border">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-36" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Form Card */}
                    <div className="lg:col-span-2">
                        <Card className="border-border">
                            <CardContent className="p-6 sm:p-8 space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-7 w-44" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full rounded-md" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-28 w-full rounded-md" />
                                <Skeleton className="h-10 w-32 rounded-md" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
