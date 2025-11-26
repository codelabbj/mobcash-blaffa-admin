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
                "flex flex-row items-center gap-4 p-4 bg-card border-2 rounded-lg",
                "hover:shadow-md transition-all cursor-pointer",
                "bg-gradient-to-br from-card via-card to-green-50/10 dark:to-green-950/10",
                isSelected
                    ? "border-primary shadow-md bg-gradient-to-br from-card via-card to-primary/5"
                    : "border-border hover:border-border",
                className,
            )}
        >
            {/* Icon Circle */}
            {icon && (
                <div className={cn(
                    "flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center",
                    "shadow-sm relative z-10 transition-all",
                    isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-primary/30 text-primary"
                )}>
                    {icon}
                </div>
            )}

            {/* Content Section */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground truncate">{title}</h3>
                        {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
                    </div>
                </div>

                {/* Details Row */}
                {details && details.length > 0 && (
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {details.slice(0, 2).map((detail, idx) => (
                            <span key={idx}>
                <span className="text-muted-foreground">{detail.label}:</span>
                <span className="font-medium text-foreground ml-1">{detail.value}</span>
              </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Amount */}
            {amount && (
                <div className={cn(
                    "flex-shrink-0 font-bold whitespace-nowrap transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                )}>
                    {amount}
                </div>
            )}

            {/* Badge and Arrow */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {badge && <div>{badge}</div>}
                {onClick && (
                    <div className="flex items-center text-primary group">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </div>
        </div>
    )
}
