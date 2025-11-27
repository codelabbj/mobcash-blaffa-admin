"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface RequestCardProps {
    title?: string
    subtitle?: string
    badge?: React.ReactNode
    icon?: React.ReactNode
    amount?: string
    details?: Array<{ label: string; value: string }>
    onClick?: () => void
    className?: string
    isSelected?: boolean
}

export function RequestCard({
                                title,
                                subtitle,
                                badge,
                                icon,
                                amount,
                                details,
                                onClick,
                                className,
                                isSelected = false,
                            }: RequestCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border-2 rounded-lg",
                "hover:shadow-md transition-all cursor-pointer",
                "bg-gradient-to-br from-card via-card to-green-50/10 dark:to-green-950/10",
                isSelected
                    ? "border-primary shadow-md bg-gradient-to-br from-card via-card to-primary/5"
                    : "border-border hover:border-border",
                className,
            )}
        >
            {/* Header Row: Icon + Title/Subtitle + Amount (mobile) */}
            <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0">
                {/* Icon Circle */}
                {icon && (
                    <div className={cn(
                        "flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center",
                        "shadow-sm relative z-10 transition-all",
                        isSelected
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-primary/30 text-primary"
                    )}>
                        {icon}
                    </div>
                )}

                <div className="flex flex-col space-y-2">
                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{title}</h3>
                        {subtitle && <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>}
                    </div>

                    {details && details.length > 0 && (
                        <div className="flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground px-3 sm:px-0 -mx-3 sm:mx-0 sm:flex-none hidden sm:block">
                            {details.slice(0, 2).map((detail, idx) => (
                                <span key={idx} className="whitespace-nowrap">
                                    <span className="text-muted-foreground">{detail.label}:</span>
                                    <span className="font-medium text-foreground ml-1">{detail.value}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount (Mobile) - Show on right in mobile view */}
                {amount && (
                    <div className={cn(
                        "flex-shrink-0 font-bold text-sm sm:hidden transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                    )}>
                        {amount}
                    </div>
                )}
            </div>

            {/* Details Row (Desktop and Mobile) */}
            { details && details.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground px-3 sm:px-0 -mx-3 sm:mx-0 sm:flex-none sm:hidden">
                    {details.slice(0, 2).map((detail, idx) => (
                        <span key={idx} className="whitespace-nowrap">
                            <span className="text-muted-foreground">{detail.label}:</span>
                            <span className="font-medium text-foreground ml-1">{detail.value}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* Desktop Bottom Row: Amount + Badge + Arrow */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                {amount && (
                    <div className={cn(
                        "font-bold whitespace-nowrap transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                    )}>
                        {amount}
                    </div>
                )}

                {badge && <div>{badge}</div>}
                {onClick && (
                    <div className="flex items-center text-primary group">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </div>

            {/* Mobile Badge and Arrow */}
            <div className="flex sm:hidden items-center justify-between gap-2 px-3 -mx-3">
                {badge && <div>{badge}</div>}
                {onClick && (
                    <div className="flex items-center text-primary">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    )
}
