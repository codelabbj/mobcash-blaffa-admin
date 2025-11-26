"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SidePanelProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    footer?: React.ReactNode
    width?: "sm" | "md" | "lg"
    embedded?: boolean
}

const widthClasses = {
    sm: "w-80",
    md: "w-96",
    lg: "w-[420px]",
}

export function SidePanel({ isOpen, onClose, title, children, footer, width = "lg", embedded = true }: SidePanelProps) {
    if (embedded) {
        return (
            <div
                className={cn(
                    "bg-card border border-border rounded-xl shadow-xl h-[calc(100vh-200px)] overflow-y-scroll",
                    "flex flex-col transition-all duration-300 overflow-hidden",
                    isOpen ? widthClasses[width] : "w-0",
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between h-16 px-6 border-b border-border flex-shrink-0">
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            aria-label="Close panel"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">{children}</div>
                </div>

                {/* Footer */}
                {footer && <div className="border-t border-border p-6 flex-shrink-0">{footer}</div>}
            </div>
        )
    }

    // Fallback to overlay mode for mobile
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

            <div
                className={cn(
                    "fixed right-0 top-0 bottom-0 bg-card border-l border-border shadow-xl",
                    "z-50 flex flex-col transition-all duration-300",
                    widthClasses[width],
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
            >
                {title && (
                    <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            aria-label="Close panel"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-auto">
                    <div className="p-6">{children}</div>
                </div>

                {footer && <div className="border-t border-border p-6">{footer}</div>}
            </div>
        </>
    )
}
