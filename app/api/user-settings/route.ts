import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({
                darkMode: false,
                compactMode: false,
                animations: true,
                language: 'id',
                itemsPerPage: 10
            })
        }

        const settings = await prisma.userSettings.findUnique({
            where: { userId: session.user.id }
        })

        if (!settings) {
            return NextResponse.json({
                darkMode: false,
                compactMode: false,
                animations: true,
                language: 'id',
                itemsPerPage: 10
            })
        }

        return NextResponse.json({
            darkMode: settings.darkMode,
            compactMode: settings.compactMode,
            animations: settings.animations,
            language: settings.language,
            itemsPerPage: settings.itemsPerPage
        })
    } catch (error) {
        console.error('Error fetching user settings:', error)
        return NextResponse.json({
            darkMode: false,
            compactMode: false,
            animations: true,
            language: 'id',
            itemsPerPage: 10
        })
    }
}
