import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AdminLoading() {
    return (
        <div className="space-y-6">
            {/* Header / Title area skeleton */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                <Skeleton className="h-10 w-[250px]" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-[260px]" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
            </div>

            {/* Stats area skeleton - Umumnya ada di dashboard, tapi aman untuk jadi placeholder generic */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="dark:border-gray-700 dark:bg-gray-800">
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

            {/* Main content area skeleton */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card className="dark:border-gray-700 dark:bg-gray-800 h-[400px]">
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px]" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

