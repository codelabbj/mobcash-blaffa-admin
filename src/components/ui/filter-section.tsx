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
        <div className={cn("grid gap-4 grid-cols-6 items-center", className)}>
            {/* Search Bar */}
            {onSearchChange && (
                <div className=" col-span-3 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={cn(
                            "w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-input",
                            "text-foreground placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring",
                        )}
                    />
                </div>
            )}

            {
                filters && filters.length > 0 && filters.map((filter, idx) => (
                    <Select
                        key={idx}
                        value={filter.value}
                        onValueChange={(e)=>filter.onChange(e)}
                    >
                        <SelectTrigger className={cn(
                            "px-3 py-5 rounded-lg bg-input border border-input w-full",
                            "text-sm text-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring",
                        )}>
                            <SelectValue placeholder={filter.placeholder}/>
                        </SelectTrigger>
                        <SelectContent>
                            {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))
            }

            {/* Filter Row */}
            {filters && filters.length > 0 && hasActiveFilters && onClearAll && (
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <CircleX className="w-4 h-4" />
                    Annuler
                </button>
            )}
        </div>
    )
}
