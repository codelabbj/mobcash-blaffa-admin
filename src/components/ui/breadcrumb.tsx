"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("flex items-center gap-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
            )}
            {item.href && !item.isCurrentPage ? (
              <Link
                href={item.href}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                "transition-colors",
                item.isCurrentPage
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}