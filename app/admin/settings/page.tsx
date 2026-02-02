import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import SettingsClient from "./settings-client"
import { getUserSettings } from "./actions"

export default async function SettingsPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    // Fetch full user data including phone and bio
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bio: true,
        }
    })

    if (!user) {
        redirect("/login")
    }

    // Fetch user settings
    const settings = await getUserSettings(session.user.id)

    return <SettingsClient user={user} settings={settings} />
}
