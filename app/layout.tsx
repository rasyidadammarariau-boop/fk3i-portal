import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

// Inter: standar emas font layar — sangat nyaman di mata, dipakai Vercel, Notion, Linear
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

// Lora: serif yang lembut & hangat untuk heading — lebih readable dari Playfair di layar
const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora",
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: '%s | BEM Pesantren Indonesia',
        default: 'BEM Pesantren Indonesia',
    },
    description: "Organisasi mahasiswa santri Indonesia yang bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan mahasiswa pesantren di seluruh Indonesia.",
    keywords: ["BEM Pesantren Indonesia", "Mahasiswa Santri", "Pesantren", "Islam", "Pendidikan Pesantren", "BEM Pesantren"],
    authors: [{ name: "BEM Pesantren Indonesia" }],
    creator: "BEM Pesantren Indonesia",
    publisher: "BEM Pesantren Indonesia",
    openGraph: {
        title: "BEM Pesantren Indonesia",
        description: "Organisasi mahasiswa santri Indonesia yang bergerak dalam penguatan keagamaan, keilmuan, dan pemberdayaan mahasiswa pesantren di seluruh Indonesia.",
        url: "https://bem-pesantren.or.id",
        siteName: "BEM Pesantren Indonesia",
        images: [
            {
                url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop",
                width: 1200,
                height: 630,
            },
        ],
        locale: "id_ID",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "BEM Pesantren Indonesia",
        description: "Organisasi mahasiswa santri Indonesia - BEM Pesantren Indonesia",
        images: ["https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body
                className={`${lora.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen selection:bg-primary/20`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
