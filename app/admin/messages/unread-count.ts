'use server'

import prisma from "@/lib/prisma"

export async function getUnreadMessagesCount(): Promise<number> {
    try {
        return await prisma.contactMessage.count({
            where: { status: "new" }
        })
    } catch {
        return 0
    }
}
