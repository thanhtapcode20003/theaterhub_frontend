import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="m-4 h-10 w-10 bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105" />
        {children}
      </main>
    </SidebarProvider>
  );
}
