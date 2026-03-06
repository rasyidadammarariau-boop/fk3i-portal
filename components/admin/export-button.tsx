"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

export function ExportButton({ data }: { data: Array<Record<string, unknown>> }) {
    const handleExport = () => {
        try {
            if (!data || data.length === 0) {
                toast.error("Tidak ada data untuk diexport")
                return
            }

            const worksheet = XLSX.utils.json_to_sheet(data)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard Stats")

            XLSX.writeFile(workbook, `dashboard-export-${new Date().toISOString().split('T')[0]}.xlsx`)

            toast.success("Data berhasil diexport ke Excel")
        } catch {
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

