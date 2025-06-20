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
            <SidebarMenuButton
              size="lg"
              className="text-white hover:sidebar-hover-gradient transition-all duration-200 my-2 rounded-lg"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg sidebar-red-gradient text-white shadow-lg">
                <Crown className="size-4 text-yellow-400" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
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
          <SidebarGroupLabel className="text-red-400 font-semibold tracking-wide uppercase text-xs px-4 py-3">
            <h2 className="text-red-400">Menu</h2>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-white hover:sidebar-hover-gradient hover:text-white active:sidebar-active-gradient transition-all duration-200 rounded-lg"
                  >
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
      <SidebarFooter className="border-t border-sidebar-border/30 bg-gradient-to-r from-black/50 to-dark-300/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:sidebar-active-gradient hover:sidebar-hover-gradient text-white transition-all duration-200 my-2 rounded-lg "
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg sidebar-red-gradient text-white shadow-lg">
                    <User className="size-4 " />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
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
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-black border border-red-900/30 shadow-xl"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-white hover:bg-red-600/20 hover:text-white focus:bg-red-600/20 focus:text-white">
                  <Sparkles className="mr-2 h-4 w-4 text-red-400" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-red-600/20 hover:text-white focus:bg-red-600/20 focus:text-white">
                  <User className="mr-2 h-4 w-4 text-red-400" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-red-600/20 hover:text-white focus:bg-red-600/20 focus:text-white">
                  <CreditCard className="mr-2 h-4 w-4 text-red-400" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-red-600/20 hover:text-white focus:bg-red-600/20 focus:text-white">
                  <Bell className="mr-2 h-4 w-4 text-red-400" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-red-900/30" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-600/20 hover:text-red-300 focus:bg-red-600/20 focus:text-red-300">
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
