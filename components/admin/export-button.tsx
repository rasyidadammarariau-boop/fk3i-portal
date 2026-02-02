"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

export function ExportButton() {
    const handleExport = () => {
        try {
            // Mock data for now - in a real app this would fetch from an API
            const data = [
                { Category: "Berita", Count: 125, Trend: "+12.5%" },
                { Category: "Galeri", Count: 42, Trend: "+4.2%" },
                { Category: "Agenda", Count: 15, Trend: "-2.1%" },
                { Category: "Pengguna", Count: 1250, Trend: "+8.1%" },
            ]

            const worksheet = XLSX.utils.json_to_sheet(data)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard Stats")

            XLSX.writeFile(workbook, `dashboard-export-${new Date().toISOString().split('T')[0]}.xlsx`)

            toast.success("Data berhasil diexport ke Excel")
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Gagal mengexport data")
        }
    }

    return (
        <Button
            variant="outline"
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onClick={handleExport}
        >
            <Download className="mr-2 h-4 w-4" />
            Export
        </Button>
    )
}
