import { Suspense } from "react"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Download, Users, FileText, Image as ImageIcon, ArrowUpRight, ArrowDownRight, Clock, Eye, BookOpen } from "lucide-react"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { ChartPieInteractive } from "@/components/admin/pie-chart"
import { ExportButton } from "@/components/admin/export-button"
import { StatsSkeleton, ChartsSkeleton, ActivitySkeleton } from "@/components/admin/dashboard-skeletons"
import { redirect } from "next/navigation"

// Wrapper to allow streaming both charts together
function ChartSection({ chartData, pieData }: { chartData: Array<{ date: string; berita: number; galeri: number }>, pieData: Array<{ category: string; count: number; fill: string }> }) {
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

async function ExportButtonServer() {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
        newsCount, newsThisMonth, newsLastMonth,
        galleryCount, galleryThisMonth, galleryLastMonth,
        docCount,
    ] = await Promise.all([
        prisma.news.count(),
        prisma.news.count({ where: { createdAt: { gte: startOfThisMonth } } }),
        prisma.news.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
        prisma.galleryAlbum.count(),
        prisma.galleryAlbum.count({ where: { createdAt: { gte: startOfThisMonth } } }),
        prisma.galleryAlbum.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
        prisma.orgDocument.count({ where: { published: true } }),
    ])

    const calcChange = (current: number, lastMonth: number) => {
        if (lastMonth === 0) return current > 0 ? "+100%" : "0%"
        const diff = ((current - lastMonth) / lastMonth * 100)
        return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%"
    }

    const exportData = [
        { Category: "Berita", Count: newsCount, Trend: calcChange(newsThisMonth, newsLastMonth) },
        { Category: "Arsip Pergerakan", Count: galleryCount, Trend: calcChange(galleryThisMonth, galleryLastMonth) },
        { Category: "Dokumen", Count: docCount, Trend: "-" },
    ]

    return <ExportButton data={exportData} />
}

async function DashboardStats() {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())

    const [
        newsCount, newsThisMonth, newsLastMonth,
        galleryCount, galleryThisMonth, galleryLastMonth,
        docCount,
        totalViews,
        messagesThisMonth,
    ] = await Promise.all([
        prisma.news.count(),
        prisma.news.count({ where: { createdAt: { gte: startOfThisMonth } } }),
        prisma.news.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),

        prisma.galleryAlbum.count(),
        prisma.galleryAlbum.count({ where: { createdAt: { gte: startOfThisMonth } } }),
        prisma.galleryAlbum.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),

        prisma.orgDocument.count({ where: { published: true } }),

        prisma.news.aggregate({ _sum: { views: true } }).then(r => r._sum.views || 0),

        prisma.contactMessage.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    ])

    const calcChange = (current: number, lastMonth: number) => {
        if (lastMonth === 0) return current > 0 ? "+100%" : "0%"
        const diff = ((current - lastMonth) / lastMonth * 100)
        return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%"
    }

    const stats = [
        {
            title: "Publikasi",
            value: newsCount,
            change: calcChange(newsThisMonth, newsLastMonth),
            trend: newsThisMonth >= newsLastMonth ? "up" : "down",
            icon: FileText,
            sub: `${newsThisMonth} bulan ini`,
        },
        {
            title: "Arsip Pergerakan",
            value: galleryCount,
            change: calcChange(galleryThisMonth, galleryLastMonth),
            trend: galleryThisMonth >= galleryLastMonth ? "up" : "down",
            icon: ImageIcon,
            sub: `${galleryThisMonth} bulan ini`,
        },
        {
            title: "Dokumen Organisasi",
            value: docCount,
            change: "",
            trend: "up",
            icon: BookOpen,
            sub: "dipublikasikan",
        },
        {
            title: "Total Views Warta",
            value: totalViews.toLocaleString('id-ID'),
            change: "",
            trend: "up",
            icon: Eye,
            sub: `${messagesThisMonth} aspirasi bulan ini`,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="transition-all hover:scale-105 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className="p-2 rounded-full bg-secondary">
                            <stat.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            {stat.change && (
                                <>
                                    {stat.trend === "up"
                                        ? <ArrowUpRight className="mr-1 h-3 w-3" />
                                        : <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                                    <span className={stat.trend === "up" ? "" : "text-destructive"}>{stat.change}</span>
                                    <span className="ml-1">dari bulan lalu •</span>
                                    <span className="ml-1">{stat.sub}</span>
                                </>
                            )}
                            {!stat.change && stat.sub}
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

    // Combine and sort
    const activities = [
        ...recentNews.map((n: { id: string, title: string, createdAt: Date, slug: string }) => ({ ...n, type: 'Berita' }))
    ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    return (
        <Card className="col-span-1 md:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Aktivitas Terbaru
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{activity.title}</p>
                                <p className="text-xs ">
                                    {activity.type} • {new Date(activity.createdAt).toLocaleDateString("id-ID", {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-sm ">
                                {new Date(activity.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-center  text-sm">Belum ada aktivitas.</p>
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

    const [news, gallery] = await Promise.all([
        prisma.news.findMany({
            where: { createdAt: { gte: ninetyDaysAgo } },
            select: { createdAt: true }
        }),
        prisma.galleryAlbum.findMany({
            where: { createdAt: { gte: ninetyDaysAgo } },
            select: { createdAt: true }
        })
    ])

    // Group by date
    const dailyData = new Map<string, { date: string; berita: number; galeri: number }>()

    // Initialize last 90 days with 0
    for (let i = 0; i <= 90; i++) {
        const d = new Date(ninetyDaysAgo)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        dailyData.set(dateStr, { date: dateStr, berita: 0, galeri: 0 })
    }

    // Fill counts
    news.forEach((n: { createdAt: Date }) => {
        const dateStr = n.createdAt.toISOString().split('T')[0]
        if (dailyData.has(dateStr)) dailyData.get(dateStr)!.berita++
    })
    gallery.forEach((g: { createdAt: Date }) => {
        const dateStr = g.createdAt.toISOString().split('T')[0]
        if (dailyData.has(dateStr)) dailyData.get(dateStr)!.galeri++
    })

    return Array.from(dailyData.values())
}

async function getPieData() {
    const [newsCount, galleryCount, docCount] = await Promise.all([
        prisma.news.count(),
        prisma.galleryAlbum.count(),
        prisma.orgDocument.count({ where: { published: true } }),
    ])

    return [
        { category: "Warta", count: newsCount, fill: "var(--color-berita)" },
        { category: "Arsip", count: galleryCount, fill: "var(--color-galeri)" },
        { category: "Dokumen", count: docCount, fill: "hsl(var(--primary) / 0.6)" },
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
                <h2 className="text-3xl font-bold tracking-tight">
                    Dashboard Overview
                </h2>
                <div className="flex items-center space-x-2">
                    <CalendarDateRangePicker />
                    <Suspense fallback={<Button variant="outline" disabled><Download className="mr-2 h-4 w-4" />Export</Button>}>
                        <ExportButtonServer />
                    </Suspense>
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

