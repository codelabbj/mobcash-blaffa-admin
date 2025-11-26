"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface RequestListLayoutProps {
    children: React.ReactNode
    listSection: React.ReactNode
    panelSection?: React.ReactNode
    className?: string
}

export function RequestListLayout({ listSection, panelSection, className }: RequestListLayoutProps) {
    return (
        <div className={cn("flex gap-6 h-full", className)}>
            {/* List Section */}
            <div className="flex-1 min-w-0 overflow-auto">{listSection}</div>

            {/* Panel Section - Embedded */}
            {panelSection && <div className="hidden lg:flex flex-col">{panelSection}</div>}
        </div>
    )
}
