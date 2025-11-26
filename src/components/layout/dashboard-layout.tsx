"use client"

import { type ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./sidebar"
import { BreadcrumbNav } from "./breadcrumb-nav"

interface DashboardLayoutProps {
    children: ReactNode
    title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden bg-background">
                {/* Breadcrumb Navigation */}
                <BreadcrumbNav />
                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-[radial-gradient(circle,#00000015_1px,transparent_1px)] bg-[length:20px_20px]">
                    <div className="h-full">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    )
}
