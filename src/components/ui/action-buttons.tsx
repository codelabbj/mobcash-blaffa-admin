"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
    onAccept?: () => void
    onReject?: () => void
    onClose?: () => void
    acceptLabel?: string
    rejectLabel?: string
    closeLabel?: string
    isLoading?: boolean
    layout?: "horizontal" | "vertical"
    className?: string
}

export function ActionButtons({
                                  onAccept,
                                  onReject,
                                  onClose,
                                  acceptLabel = "Accept",
                                  rejectLabel = "Reject",
                                  closeLabel = "Close",
                                  isLoading = false,
                                  layout = "horizontal",
                                  className,
                              }: ActionButtonsProps) {
    const containerClass = layout === "vertical" ? "flex-col" : "flex-row"

    return (
        <div className={cn("flex gap-3", containerClass, className)}>
            {onAccept && (
                <Button onClick={onAccept} disabled={isLoading} className="flex-1">
                    {acceptLabel}
                </Button>
            )}
            {onReject && (
                <Button onClick={onReject} variant="destructive" disabled={isLoading} className="flex-1">
                    {rejectLabel}
                </Button>
            )}
            {onClose && (
                <Button onClick={onClose} variant="outline" disabled={isLoading} className="flex-1 bg-transparent">
                    {closeLabel}
                </Button>
            )}
        </div>
    )
}
