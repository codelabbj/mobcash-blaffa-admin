"use client"

import { Menu, X, LogOut, Settings } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TopBarProps {
    title?: string
    onSidebarToggle: () => void
    sidebarOpen: boolean
}

export function TopBar({ title, onSidebarToggle, sidebarOpen }: TopBarProps) {
    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            {/* Left Section - Sidebar Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onSidebarToggle}
                    className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="text-lg font-semibold text-foreground">{title || "Dashboard"}</h1>
            </div>

            {/* Right Section - User Menu */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                            <Avatar initials="AD" size="sm" className="w-8 h-8" />
                            <span className="text-sm font-medium hidden sm:inline">Admin</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
