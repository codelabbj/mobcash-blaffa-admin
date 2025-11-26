import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardContentProps {
    children: React.ReactNode
    className?: string
}

export function DashboardContent({ children, className }: DashboardContentProps) {
    return <div className={cn("p-6 h-full", className)}>{children}</div>
}
