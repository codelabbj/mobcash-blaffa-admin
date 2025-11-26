"use client"

import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export function BreadcrumbNav() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <Breadcrumb
      items={breadcrumbs}
      className="px-6 py-4 border-b border-border bg-card"
    />
  )
}