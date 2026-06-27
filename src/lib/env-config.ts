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

/** Nettoie une URL de base : trim + retire les slashes finaux. */
export function normalizeApiBase(raw: string | undefined): string {
  return (raw ?? "").trim().replace(/\/+$/, "")
}

function readApiBaseFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    ""
  )
}

/**
 * URL de base API avec slash final.
 * Accepte : https://api.com ou https://api.com/ (les deux OK).
 */
export function getApiBaseUrl(): string {
  const base = normalizeApiBase(readApiBaseFromEnv())
  return base ? `${base}/` : ""
}

/** Joint intelligemment base + chemin (slashes ajoutés/retirés automatiquement). */
export function apiUrl(path: string): string {
  const base = normalizeApiBase(readApiBaseFromEnv())
  const normalizedPath = path.trim().replace(/^\/+/, "")
  if (!base) return `/${normalizedPath}`
  return `${base}/${normalizedPath}`
}

// --- Branding (white-label) ---

export function getAppName(): string {
  return (process.env.NEXT_PUBLIC_APP_NAME || "MobCash").trim()
}

export function getAppTagline(): string {
  return (process.env.NEXT_PUBLIC_APP_TAGLINE || "Admin dashboard").trim()
}

export function getAppLogo(): string {
  return (process.env.NEXT_PUBLIC_APP_LOGO || "").trim()
}

export function getAppShortName(): string {
  const raw = process.env.NEXT_PUBLIC_APP_SHORT_NAME?.trim()
  if (raw) return raw
  return getAppName()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MC"
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
