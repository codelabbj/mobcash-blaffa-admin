import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

const breadcrumbMap: Record<string, string> = {
  "": "Tableau de bord",
  dashboard: "Tableau de bord",
  recharges: "Demandes de Recharge",
  cancellations: "Demandes d'Annulation",
  platform: "Plateformes",
  cashdesk: "Caisse",
  users: "Utilisateurs",
  "admin-transactions": "Transactions Admin",
  permissions: "Permissions",
  "commission-config": "Configuration Commission",
  profile: "Profil",
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()

  // Always start with dashboard
  const items: BreadcrumbItem[] = [
    {
      label: breadcrumbMap["dashboard"] || "Tableau de bord",
      href: "/dashboard",
      isCurrentPage: pathname === "/dashboard",
    },
  ]

  if (pathname === "/dashboard") {
    items[0].isCurrentPage = true
    return items
  }

  // Split the pathname and build breadcrumbs
  const segments = pathname.split("/").filter(Boolean)
  let currentPath = ""

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    // Skip the dashboard segment as it's already the root
    if (segment === "dashboard" && i === 0) {
      continue
    }

    const label = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLastSegment = i === segments.length - 1

    items.push({
      label,
      href: isLastSegment ? undefined : currentPath,
      isCurrentPage: isLastSegment,
    })
  }

  return items
}