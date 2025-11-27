"use client"

import { cn } from "@/lib/utils"
import {CircleX, Search} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface FilterOption {
    value: string
    label: string
}

interface FilterSectionProps {
    searchValue?: string
    onSearchChange?: (value: string) => void
    filters?: Array<{
        label: string
        value: string
        placeholder:string
        options: FilterOption[]
        onChange: (value: string) => void
    }>
    onClearAll?: () => void
    className?: string
}

export function FilterSection({
                                  searchValue = "",
                                  onSearchChange,
                                  filters,
                                  onClearAll,
                                  className,
                              }: FilterSectionProps) {
    const hasActiveFilters = searchValue || filters?.some((f) => f.value)

    return (
        <div className={cn("grid grid-cols-3 sm:grid-cols-6 gap-3 w-full", className)}>
            {/* Search Bar - Full Width and Larger */}
            {onSearchChange && (
                <div className="col-span-3 relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={cn(
                            "w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-input",
                            "text-foreground placeholder:text-muted-foreground text-sm sm:text-base",
                            "focus:outline-none focus:ring-2 focus:ring-ring",
                        )}
                    />
                </div>
            )}

            {filters && filters.length > 0 && filters.map((filter, idx) => (
                <Select
                    key={idx}
                    value={filter.value}
                    onValueChange={(e) => filter.onChange(e)}
                >
                    <SelectTrigger className={cn(
                        "px-3 py-6 rounded-lg bg-input border border-input w-full",
                        "text-xs sm:text-sm text-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-ring",
                        "flex-1 sm:flex-none"
                    )}>
                        <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ))}

            {/* Clear Filter Button - Flex Shrink */}
            {filters && filters.length > 0 && hasActiveFilters && onClearAll && (
                <button
                    onClick={onClearAll}
                    className={cn(
                        "flex items-center gap-1 px-3 py-2 flex-shrink-0 whitespace-nowrap w-full",
                        "text-xs sm:text-sm text-muted-foreground hover:text-foreground",
                        "transition-colors rounded-lg hover:bg-muted",
                    )}
                >
                    <CircleX className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Annuler</span>
                </button>
            )}
        </div>
    )
}
