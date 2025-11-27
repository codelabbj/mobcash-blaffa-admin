import { Skeleton } from "@/components/ui/skeleton"
import type React from "react"

export default function RequestCardSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border-2 rounded-lg hover:shadow-md transition-all bg-gradient-to-br from-card via-card to-green-50/10 dark:to-green-950/10 border-border">
            {/* Header Row: Icon + Title/Subtitle + Amount (mobile) */}
            <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0">
                {/* Icon Circle Skeleton */}
                <Skeleton className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-sm" />

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    {/* Title and Subtitle */}
                    <Skeleton className="h-5 w-32 sm:w-48 mb-1" />
                    <Skeleton className="h-4 w-24 sm:w-32" />
                </div>

                {/* Amount Skeleton (Mobile) */}
                <Skeleton className="flex-shrink-0 h-4 w-16 sm:hidden" />
            </div>

            {/* Details Row (Desktop and Mobile) */}
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs px-3 sm:px-0 -mx-3 sm:mx-0 sm:flex-none">
                {[1, 2].map((detail, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                        <Skeleton className="h-3 w-10 sm:w-12" />
                        <Skeleton className="h-3 w-12 sm:w-16" />
                    </span>
                ))}
            </div>

            {/* Desktop Amount + Badge + Arrow */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            {/* Mobile Badge and Arrow */}
            <div className="flex sm:hidden items-center justify-between gap-2 px-3 -mx-3">
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
        </div>
    )
}