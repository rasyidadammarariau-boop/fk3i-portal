import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
});

export const metadata: Metadata = {
    title: {
        template: '%s | FK3i - Forum Komunikasi Kyai Kampung Indonesia',
        default: 'FK3i - Forum Komunikasi Kyai Kampung Indonesia',
    },
    description: "Wadah silaturahmi dan pergerakan kyai kampung dalam menjaga nilai-nilai keislaman, kebangsaan, dan pemberdayaan umat berbasis kearifan lokal.",
    keywords: ["FK3i", "Kyai Kampung", "Ulama", "Islam Nusantara", "Pesantren", "Dakwah"],
    authors: [{ name: "FK3i Pusat" }],
    creator: "FK3i",
    publisher: "FK3i",
    openGraph: {
        title: "FK3i - Forum Komunikasi Kyai Kampung Indonesia",
        description: "Wadah silaturahmi dan pergerakan kyai kampung dalam menjaga nilai-nilai keislaman dan kebangsaan.",
        url: "https://fk3i.or.id",
        siteName: "FK3i",
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
        title: "FK3i - Kyai Kampung Membangun Peradaban",
        description: "Forum Komunikasi Kyai Kampung Indonesia",
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
                className={`${playfair.variable} ${plusJakarta.variable} font-sans antialiased flex flex-col min-h-screen selection:bg-primary/20`}
            >
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var localTheme = localStorage.getItem('theme-preference');
                                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                    
                                    if (localTheme === 'dark' || (!localTheme && systemTheme)) {
                                        document.documentElement.classList.add('dark');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                    }
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
