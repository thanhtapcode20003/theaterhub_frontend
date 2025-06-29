import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import RoleRouteGuard from "@/components/auth/RoleRouteGuard";
import { notFound } from "next/navigation";

interface RoleLayoutProps {
  children: React.ReactNode;
  params: { role: string };
}

export default function RoleLayout({ children, params }: RoleLayoutProps) {
  const { role } = params;

  // Validate that the role is either admin or staff
  if (role !== "admin" && role !== "staff") {
    notFound();
  }

  // Determine allowed roles based on the route
  const allowedRoles: ("admin" | "staff" | "customer")[] =
    role === "admin" ? ["admin"] : ["staff"];

  return (
    <RoleRouteGuard allowedRoles={allowedRoles}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 bg-zinc-950 min-h-screen">
          {/* Top Header Bar */}
          <div className="sticky top-0 z-50 flex items-center gap-4 px-6 pt-4 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
            <SidebarTrigger className="sidebar-trigger-enhanced" />
            <div className="flex-1"></div>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </RoleRouteGuard>
  );
}

// Generate static params for known roles
export function generateStaticParams() {
  return [{ role: "admin" }, { role: "staff" }];
}
