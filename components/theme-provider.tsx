"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)

        // Initial theme validation using local storage or system preference
        const localTheme = localStorage.getItem('theme-preference')
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (localTheme === 'dark' || (!localTheme && systemDark)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    React.useEffect(() => {
        if (!mounted) return

        // Fetch user settings and apply theme
        const fetchAndApplySettings = async () => {
            try {
                const response = await fetch('/api/user-settings')
                if (response.ok) {
                    const settings = await response.json()

                    // Apply dark mode & Sync to localStorage
                    const isDark = settings.darkMode
                    if (isDark) {
                        document.documentElement.classList.add('dark')
                        localStorage.setItem('theme-preference', 'dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                        localStorage.setItem('theme-preference', 'light')
                    }

                    // Apply compact mode
                    if (settings.compactMode) {
                        document.documentElement.classList.add('compact')
                    } else {
                        document.documentElement.classList.remove('compact')
                    }

                    // Apply animations
                    if (!settings.animations) {
                        document.documentElement.classList.add('no-animations')
                    } else {
                        document.documentElement.classList.remove('no-animations')
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user settings:', error)
            }
        }

        if (session?.user) {
            fetchAndApplySettings()
        }
    }, [session, mounted])

    return <>{children}</>
}
