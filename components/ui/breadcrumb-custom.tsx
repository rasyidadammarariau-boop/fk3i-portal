import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm ">
                <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                        <Home className="w-4 h-4" />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
                        {item.href ? (
                            <Link href={item.href} className="hover:text-primary transition-colors font-medium">
                                {item.label}
                            </Link>
                        ) : (
                            <span className=" font-semibold line-clamp-1 max-w-[200px] md:max-w-none">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

