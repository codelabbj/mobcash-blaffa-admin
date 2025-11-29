"use client"

import Link from "next/link"
import { Menu, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"
import { useLogout } from "@/hooks/use-auth"

export function MobileTopbar() {
  const { toggleSidebar } = useSidebar()
  const { user } = useAuth()
  const logout = useLogout()

  const getUserInitials = () => {
    if (user && user.first_name && user.last_name && user.first_name !== "" && user.last_name !== "") {
      return user.first_name.toUpperCase()[0] + user.last_name.toUpperCase()[0]
    }
    return "US"
  }

  const handleLogout = () => {
    logout.mutate()
  }

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-sidebar-border">
      <div className="flex items-center justify-between p-4 h-16">
        {/* Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-sidebar-foreground" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{
              background:
                "radial-gradient(135% 135% at 50% 50%, oklch(0.5 0.2 25) 0%, oklch(0.05 0.01 280) 100%)",
            }}
          >
            MB
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">MobCash</span>
        </Link>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel className="text-xs">Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}