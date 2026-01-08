"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import { cn } from "@/lib/utils"
import {ArrowUpRight, XSquare, Users, Shield, User, LogOut, Boxes, Wallet, Settings,ArrowLeftRight} from "lucide-react"
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
import {useAuth} from "@/providers/auth-provider";
import {useLogout} from "@/hooks/use-auth";

const navItems = [
  {
    label: "Demandes de Recharge",
    labelEn: "Recharges Requests",
    href: "/dashboard/recharges",
    icon: ArrowUpRight,
  },
  {
    label: "Demandes d'Annulation",
    labelEn: "Cancellation Requests",
    href: "/dashboard/cancellations",
    icon: XSquare,
  },
    {
        label: "Plateformes",
        labelEn: "Platforms",
        href: "/dashboard/platform",
        icon: Boxes

    },
    {
        label: "Caisse",
        labelEn: "CashDesks",
        href: "/dashboard/cashdesk",
        icon: Wallet
    },
  {
    label: "Utilisateurs",
    labelEn: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
    {
        label: "Transactions Admin",
        labelEn: "Admin Transactions",
        href: "/dashboard/admin-transactions",
        icon: ArrowLeftRight,
    },
  {
    label: "Permissions",
    labelEn: "Permissions",
    href: "/dashboard/permissions",
    icon: Shield,
  },
    {
        label:"Configuration Commission",
        labelEn: "Commission Configuration",
        href: "/dashboard/commission-config",
        icon: Settings,
    }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
    const {user} = useAuth()
    const logout = useLogout()

    const getUserInitials= ()=>{
        if (user && user.first_name && user.last_name && user.first_name!=="" && user.last_name!=="") {
            return user.first_name.toUpperCase()[0]+user.last_name.toUpperCase()[0]
        }
        return "US"
    }

    const handleLogout = ()=>{
      logout.mutate()
    }

  return (
    <Sidebar collapsible="icon" className="">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link
            href="/dashboard"
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
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === "/dashboard/"+item.href || pathname.startsWith("/dashboard/"+item.href + "/")

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
                      onClick={() => {
                        // Close sidebar on mobile after navigation
                        if (window.innerWidth < 768) {
                          toggleSidebar()
                        }
                      }}
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
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "flex flex-col items-start text-sm transition-opacity duration-300",
                    state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    <span className="font-semibold text-sidebar-foreground">{(user?.first_name||"")+" "+(user?.last_name||"")}</span>
                    <span className="text-sidebar-foreground/60 text-xs">{user?.email||"N/A"}</span>
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
                <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleLogout}>
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