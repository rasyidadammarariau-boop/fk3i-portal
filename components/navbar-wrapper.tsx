"use client"

import dynamic from "next/dynamic"

// Navbar harus di-import tanpa SSR karena memakai useEffect (scroll state)
// dan Radix UI (Sheet, DropdownMenu) yang menggenerate ID berbeda di server vs client
const NavbarDynamic = dynamic(() => import("./Navbar"), { ssr: false })

export function NavbarWrapper() {
    return <NavbarDynamic />
}
