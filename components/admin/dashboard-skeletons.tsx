import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-[60px] mb-2" />
                        <Skeleton className="h-3 w-[140px]" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function ChartsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px] mb-2" />
                        <Skeleton className="h-4 w-[300px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-3">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[200px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full rounded-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export function ActivitySkeleton() {
    return (
        <Card className="col-span-1 md:col-span-3">
            <CardHeader>
                <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center">
                            <div className="ml-4 space-y-1 w-full">
                                <Skeleton className="h-4 w-[200px] mb-2" />
                                <Skeleton className="h-3 w-[150px]" />
                            </div>
                            <div className="ml-auto">
                                <Skeleton className="h-4 w-[50px]" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

