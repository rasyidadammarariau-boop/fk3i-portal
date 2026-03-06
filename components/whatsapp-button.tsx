'use client'

import { MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface WhatsAppButtonProps {
    phoneNumber: string
}

export function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const handleClick = () => {
        window.open(`https://wa.me/${phoneNumber}`, '_blank')
    }

    if (!phoneNumber) return null

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
            aria-label="Chat via WhatsApp"
        >
            <MessageCircle className="w-6 h-6 animate-pulse" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat via WhatsApp
            </span>
        </button>
    )
}

