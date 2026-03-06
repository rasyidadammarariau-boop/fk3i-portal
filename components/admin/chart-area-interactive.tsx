"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"



const chartConfig = {
    visitors: {
        label: "Total Konten",
    },
    berita: {
        label: "Berita",
        color: "var(--chart-1)",
    },
    agenda: {
        label: "Agenda",
        color: "var(--chart-2)",
    },
    galeri: {
        label: "Galeri",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: { data: Array<{ date: string; berita: number; agenda?: number; galeri: number }> }) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = data.filter((item) => {
        const date = new Date(item.date)
        const today = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(today)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Statistik Konten</CardTitle>
                    <CardDescription>
                        Menampilkan trend upload konten
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="3 Bulan Terakhir" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            3 Bulan Terakhir
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            30 Hari Terakhir
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            7 Hari Terakhir
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillBerita" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-berita)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-berita)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillAgenda" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-agenda)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-agenda)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillGaleri" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-galeri)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-galeri)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("id-ID", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("id-ID", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="berita"
                            type="natural"
                            fill="url(#fillBerita)"
                            stroke="var(--color-berita)"
                            stackId="a"
                        />
                        <Area
                            dataKey="agenda"
                            type="natural"
                            fill="url(#fillAgenda)"
                            stroke="var(--color-agenda)"
                            stackId="a"
                        />
                        <Area
                            dataKey="galeri"
                            type="natural"
                            fill="url(#fillGaleri)"
                            stroke="var(--color-galeri)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

