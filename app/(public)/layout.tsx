import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import prisma from "@/lib/prisma";

async function getWhatsAppNumber() {
    try {
        const profile = await prisma.organizationProfile.findUnique({
            where: { id: "default" },
            select: { whatsapp: true }
        })
        return profile?.whatsapp || null
    } catch {
        return null
    }
}

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const whatsappNumber = await getWhatsAppNumber()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            {whatsappNumber && <WhatsAppButton phoneNumber={whatsappNumber} />}
        </div>
    );
}

