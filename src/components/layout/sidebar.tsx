"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {ArrowUpRight, XSquare, Users, Shield, User, LogOut, Boxes, Wallet} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  {
    label: "Demandes de Recharge",
    labelEn: "Recharges Requests",
    href: "/recharges",
    icon: ArrowUpRight,
  },
  {
    label: "Demandes d'Annulation",
    labelEn: "Cancellation Requests",
    href: "/cancellations",
    icon: XSquare,
  },
    {
        label: "Plateformes",
        labelEn: "Platforms",
        href: "/platform",
        icon: Boxes

    },
    {
        label: "CashDesks",
        labelEn: "CashDesks",
        href: "/cashdesk",
        icon: Wallet
    },
  {
    label: "Utilisateurs",
    labelEn: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Permissions",
    labelEn: "Permissions",
    href: "/permissions",
    icon: Shield,
  },
  {
    label: "Profil",
    labelEn: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()

  // Mock user data - replace with real data from context/props
  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@mobcash.com",
    initials: "JD",
  }

  return (
    <Sidebar collapsible="icon" className="">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <button
            /* onClick={toggleSidebar} */
          className="flex items-center gap-3 w-full hover:bg-primary/10 rounded-lg p-2 transition-colors group"
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold text-base flex-shrink-0"
            style={{
              background:
                "radial-gradient(135% 135% at 50% 50%, oklch(0.5 0.2 25) 0%, oklch(0.05 0.01 280) 100%)",
            }}
          >
            MB
          </div>
          <span className={cn(
            "text-sidebar-foreground font-bold text-xl transition-opacity duration-300",
            state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
          )}>
            MobCash
          </span>
        </button>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-colors h-12 text-base group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:rounded-lg",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-primary/10 hover:text-sidebar-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className="w-6 h-6 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-primary/10 transition-colors h-12">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "flex flex-col items-start text-sm transition-opacity duration-300",
                    state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    <span className="font-semibold text-sidebar-foreground">{user.name}</span>
                    <span className="text-sidebar-foreground/60 text-xs">{user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuLabel className="text-xs">Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}