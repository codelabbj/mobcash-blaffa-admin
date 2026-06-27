/**
 * Configuration centralisée MobCash Admin (variables d'environnement).
 *
 * API : NEXT_PUBLIC_API_BASE_URL (prioritaire) ou NEXT_PUBLIC_BASE_URL (legacy).
 * Feature flags : absent ou vide → true (tout activé par défaut).
 */

export function envBool(raw: string | undefined, defaultValue = true): boolean {
  if (raw === undefined || raw.trim() === "") return defaultValue
  const v = raw.trim().toLowerCase()
  if (["false", "0", "no", "off"].includes(v)) return false
  if (["true", "1", "yes", "on"].includes(v)) return true
  return defaultValue
}

/** URL de base de l'API backend (sans slash final). */
export function getApiBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    ""
  return url.replace(/\/$/, "")
}

export const apiConfig = {
  get baseUrl() {
    return getApiBaseUrl()
  },
} as const

export const features = {
  dashboard: envBool(process.env.NEXT_PUBLIC_FEATURE_DASHBOARD),
  recharges: envBool(process.env.NEXT_PUBLIC_FEATURE_RECHARGES),
  cancellations: envBool(process.env.NEXT_PUBLIC_FEATURE_CANCELLATIONS),
  platforms: envBool(process.env.NEXT_PUBLIC_FEATURE_PLATFORMS),
  cashdesk: envBool(process.env.NEXT_PUBLIC_FEATURE_CASHDESK),
  users: envBool(process.env.NEXT_PUBLIC_FEATURE_USERS),
  adminTransactions: envBool(process.env.NEXT_PUBLIC_FEATURE_ADMIN_TRANSACTIONS),
  permissions: envBool(process.env.NEXT_PUBLIC_FEATURE_PERMISSIONS),
  commissionConfig: envBool(process.env.NEXT_PUBLIC_FEATURE_COMMISSION_CONFIG),
  profile: envBool(process.env.NEXT_PUBLIC_FEATURE_PROFILE),
} as const

export type FeatureKey = keyof typeof features

export const routeFeatureMap: { prefix: string; feature: FeatureKey }[] = [
  { prefix: "/admin-transactions", feature: "adminTransactions" },
  { prefix: "/commission-config", feature: "commissionConfig" },
  { prefix: "/cancellations", feature: "cancellations" },
  { prefix: "/recharges", feature: "recharges" },
  { prefix: "/permissions", feature: "permissions" },
  { prefix: "/platform", feature: "platforms" },
  { prefix: "/cashdesk", feature: "cashdesk" },
  { prefix: "/profile", feature: "profile" },
  { prefix: "/users", feature: "users" },
]

const sortedRouteMap = [...routeFeatureMap].sort((a, b) => b.prefix.length - a.prefix.length)

export function getFeatureForPath(pathname: string): FeatureKey | null {
  if (pathname === "/" || pathname === "") {
    return "dashboard"
  }
  for (const { prefix, feature } of sortedRouteMap) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return feature
    }
  }
  return null
}

export function isFeatureEnabled(feature: FeatureKey): boolean {
  return features[feature]
}

export function isRouteEnabled(pathname: string): boolean {
  const feature = getFeatureForPath(pathname)
  return feature ? features[feature] : true
}
