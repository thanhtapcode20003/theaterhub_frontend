import {
  ChevronUp,
  Users,
  CreditCard,
  ShieldUser,
  Bell,
  User,
  Crown,
  LogOut,
  IdCard,
  Sparkles,
  ChartSpline,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: ChartSpline,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="sidebar-gradient border-r border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border/30 bg-sidebar-red-gradient">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="sidebar-menu-button-lg">
              <div className="sidebar-icon-container">
                <Crown className="size-4 text-yellow-400" />
              </div>
              <div className="sidebar-user-text">
                <span className="truncate font-bold text-white text-2xl">
                  Admin
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-group-label">
            <h2 className="text-red-400">Menu</h2>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-menu-layout">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="sidebar-menu-button">
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="h-5 w-5 text-red-400" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="sidebar-footer-container">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="sidebar-menu-button-lg">
                  <div className="sidebar-icon-container">
                    <User className="size-4" />
                  </div>
                  <div className="sidebar-user-text">
                    <span className="truncate font-semibold text-white">
                      Admin User
                    </span>
                    <span className="truncate text-xs text-gray-300">
                      admin@theaterhub.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-red-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="dropdown-menu-container"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="dropdown-item">
                  <Sparkles className="mr-2 h-4 w-4 text-red-400" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <User className="mr-2 h-4 w-4 text-red-400" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <CreditCard className="mr-2 h-4 w-4 text-red-400" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <Bell className="mr-2 h-4 w-4 text-red-400" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-red-900/30" />
                <DropdownMenuItem className="dropdown-item-danger">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
