/**
 * Configuration centralisée MobCash Admin (variables d'environnement).
 *
 * API : NEXT_PUBLIC_API_BASE_URL (prioritaire) ou NEXT_PUBLIC_BASE_URL (legacy).
 * Feature flags : variable absente ou vide → true (tout activé par défaut).
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

/** Source unique : chaque entrée = une fonctionnalité + sa variable .env */
export const FEATURE_DEFINITIONS = [
  {
    key: "dashboard",
    env: "NEXT_PUBLIC_FEATURE_DASHBOARD",
    label: "Tableau de bord",
    route: "/",
  },
  {
    key: "recharges",
    env: "NEXT_PUBLIC_FEATURE_RECHARGES",
    label: "Demandes de recharge",
    route: "/recharges",
  },
  {
    key: "cancellations",
    env: "NEXT_PUBLIC_FEATURE_CANCELLATIONS",
    label: "Demandes d'annulation",
    route: "/cancellations",
  },
  {
    key: "platforms",
    env: "NEXT_PUBLIC_FEATURE_PLATFORMS",
    label: "Plateformes",
    route: "/platform",
  },
  {
    key: "cashdesk",
    env: "NEXT_PUBLIC_FEATURE_CASHDESK",
    label: "Caisse",
    route: "/cashdesk",
  },
  {
    key: "users",
    env: "NEXT_PUBLIC_FEATURE_USERS",
    label: "Utilisateurs",
    route: "/users",
  },
  {
    key: "adminTransactions",
    env: "NEXT_PUBLIC_FEATURE_ADMIN_TRANSACTIONS",
    label: "Transactions admin",
    route: "/admin-transactions",
  },
  {
    key: "permissions",
    env: "NEXT_PUBLIC_FEATURE_PERMISSIONS",
    label: "Permissions",
    route: "/permissions",
  },
  {
    key: "commissionConfig",
    env: "NEXT_PUBLIC_FEATURE_COMMISSION_CONFIG",
    label: "Configuration commission",
    route: "/commission-config",
  },
  {
    key: "profile",
    env: "NEXT_PUBLIC_FEATURE_PROFILE",
    label: "Profil utilisateur",
    route: "/profile",
  },
] as const

export type FeatureKey = (typeof FEATURE_DEFINITIONS)[number]["key"]

function buildFeatures(): Record<FeatureKey, boolean> {
  const out = {} as Record<FeatureKey, boolean>
  for (const def of FEATURE_DEFINITIONS) {
    out[def.key] = envBool(process.env[def.env])
  }
  return out
}

export const features = buildFeatures()

export const routeFeatureMap: { prefix: string; feature: FeatureKey }[] =
  FEATURE_DEFINITIONS.filter((d) => d.route !== "/").map((d) => ({
    prefix: d.route,
    feature: d.key,
  }))

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
