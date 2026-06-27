import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getFeatureForPath, features } from "@/lib/env-config"

const publicPaths = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }

  const feature = getFeatureForPath(pathname)
  if (feature && !features[feature]) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/recharges/:path*",
    "/cancellations/:path*",
    "/platform/:path*",
    "/cashdesk/:path*",
    "/users/:path*",
    "/admin-transactions/:path*",
    "/permissions/:path*",
    "/commission-config/:path*",
    "/profile/:path*",
  ],
}
