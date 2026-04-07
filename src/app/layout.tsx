import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import {Providers} from "@/providers/query-client-provider";

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// <CHANGE> Updated metadata for admin dashboard
export const metadata: Metadata = {
    title: "MobcashBlaffa Admin",
    description: "Admin dashboard for managing recharges, cancellations, users, and permissions",
    generator: "v0.app",
    icons: {icon: "/MB.png", },
}

// <CHANGE> Added viewport configuration for optimal mobile experience
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    userScalable: false,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#1a1f35" },
    ],
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
        </body>
        </html>
    )
}
