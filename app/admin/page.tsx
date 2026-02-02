import { Suspense } from "react"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Download, Users, FileText, Image as ImageIcon, Calendar, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { ChartPieInteractive } from "@/components/admin/pie-chart"
import { ExportButton } from "@/components/admin/export-button"
import { StatsSkeleton, ChartsSkeleton, ActivitySkeleton } from "@/components/admin/dashboard-skeletons"
import { redirect } from "next/navigation"

// Wrapper to allow streaming both charts together
function ChartSection({ chartData, pieData }: { chartData: any[], pieData: any[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
                <ChartAreaInteractive data={chartData} />
            </div>
            <div className="col-span-3">
                <ChartPieInteractive data={pieData} />
            </div>
        </div>
    )
}

async function DashboardStats() {
    const newsCount = await prisma.news.count()
    const galleryCount = await prisma.galleryAlbum.count()
    const agendaCount = await prisma.agenda.count()
    const usersCount = await prisma.user.count()

    const stats = [
        {
            title: "Total Berita",
            value: newsCount,
            change: "+12.5%",
            trend: "up",
            icon: FileText,
            color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
        },
        {
            title: "Total Galeri",
            value: galleryCount,
            change: "+4.2%",
            trend: "up",
            icon: ImageIcon,
            color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400"
        },
        {
            title: "Agenda Aktif",
            value: agendaCount,
            change: "-2.1%",
            trend: "down",
            icon: Calendar,
            color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400"
        },
        {
            title: "Pengguna",
            value: usersCount,
            change: "+8.1%",
            trend: "up",
            icon: Users,
            color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium dark:text-gray-200">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.color}`}>
                            <stat.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            {stat.trend === "up" ? (
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                            )}
                            <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                                {stat.change}
                            </span>
                            <span className="ml-1">dari bulan lalu</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

async function RecentActivity() {
    const recentNews = await prisma.news.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true, slug: true }
    })

    const recentAgenda = await prisma.agenda.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true, slug: true }
    })

    // Combine and sort
    const activities = [
        ...recentNews.map(n => ({ ...n, type: 'Berita' })),
        ...recentAgenda.map(a => ({ ...a, type: 'Agenda' }))
    ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    return (
        <Card className="col-span-1 md:col-span-3 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Clock className="h-5 w-5" />
                    Aktivitas Terbaru
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((activity, index) => (
                        <div key={activity.id} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none dark:text-gray-200">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {activity.type} • {new Date(activity.createdAt).toLocaleDateString("id-ID", {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-muted-foreground">
                                {new Date(activity.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm">Belum ada aktivitas.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

// Helper to get daily counts for the last 90 days
async function getChartData() {
    const today = new Date()
    const ninetyDaysAgo = new Date(today)
    ninetyDaysAgo.setDate(today.getDate() - 90)

    const [news, agenda, gallery] = await Promise.all([
        prisma.news.findMany({
            where: { createdAt: { gte: ninetyDaysAgo } },
            select: { createdAt: true }
        }),
        prisma.agenda.findMany({
            where: { createdAt: { gte: ninetyDaysAgo } },
            select: { createdAt: true }
        }),
        prisma.galleryAlbum.findMany({
            where: { createdAt: { gte: ninetyDaysAgo } },
            select: { createdAt: true }
        })
    ])

    // Group by date
    const dailyData = new Map<string, { date: string; berita: number; agenda: number; galeri: number }>()

    // Initialize last 90 days with 0
    for (let i = 0; i <= 90; i++) {
        const d = new Date(ninetyDaysAgo)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        dailyData.set(dateStr, { date: dateStr, berita: 0, agenda: 0, galeri: 0 })
    }

    // Fill counts
    news.forEach(n => {
        const dateStr = n.createdAt.toISOString().split('T')[0]
        if (dailyData.has(dateStr)) dailyData.get(dateStr)!.berita++
    })
    agenda.forEach(a => {
        const dateStr = a.createdAt.toISOString().split('T')[0]
        if (dailyData.has(dateStr)) dailyData.get(dateStr)!.agenda++
    })
    gallery.forEach(g => {
        const dateStr = g.createdAt.toISOString().split('T')[0]
        if (dailyData.has(dateStr)) dailyData.get(dateStr)!.galeri++
    })

    return Array.from(dailyData.values())
}

async function getPieData() {
    const [newsCount, agendaCount, galleryCount] = await Promise.all([
        prisma.news.count(),
        prisma.agenda.count(),
        prisma.galleryAlbum.count()
    ])

    return [
        { category: "Berita", count: newsCount, fill: "var(--color-berita)" },
        { category: "Agenda", count: agendaCount, fill: "var(--color-agenda)" },
        { category: "Galeri", count: galleryCount, fill: "var(--color-galeri)" },
    ]
}

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const chartData = await getChartData()
    const pieData = await getPieData()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Dashboard Overview
                </h2>
                <div className="flex items-center space-x-2">
                    <CalendarDateRangePicker />
                    <ExportButton />
                </div>
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <DashboardStats />
            </Suspense>

            <Suspense fallback={<ChartsSkeleton />}>
                <ChartSection chartData={chartData} pieData={pieData} />
            </Suspense>

            <div className="grid gap-4 md:grid-cols-1">
                <Suspense fallback={<ActivitySkeleton />}>
                    <RecentActivity />
                </Suspense>
            </div>
        </div>
    )
}
