import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
