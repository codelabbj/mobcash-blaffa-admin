"use client"

import { cn } from "@/lib/utils"
import { getAppLogo, getAppName, getAppShortName } from "@/lib/env-config"

type AppBrandMarkProps = {
  showName?: boolean
  className?: string
  nameClassName?: string
  markClassName?: string
}

/** Logo image si NEXT_PUBLIC_APP_LOGO est défini, sinon initiales (NEXT_PUBLIC_APP_SHORT_NAME). */
export function AppBrandMark({
  showName = true,
  className,
  nameClassName = "text-sidebar-foreground font-bold text-xl",
  markClassName = "w-12 h-12 rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold text-base flex-shrink-0",
}: AppBrandMarkProps) {
  const appName = getAppName()
  const logo = getAppLogo()
  const shortName = getAppShortName()

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {logo ? (
        <img
          src={logo}
          alt={`${appName} logo`}
          className={cn("h-12 w-12 object-contain flex-shrink-0", markClassName)}
        />
      ) : (
        <div
          className={markClassName}
          style={{
            background:
              "radial-gradient(135% 135% at 50% 50%, oklch(0.5 0.2 25) 0%, oklch(0.05 0.01 280) 100%)",
          }}
        >
          {shortName}
        </div>
      )}
      {showName && <span className={nameClassName}>{appName}</span>}
    </div>
  )
}
