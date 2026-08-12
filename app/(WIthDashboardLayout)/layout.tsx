// src/app/(WithDashboardLayout)/layout.tsx
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950">
        <AppSidebar />

        <SidebarInset className="flex-1 w-full min-w-0 flex flex-col p-4 sm:p-6 overflow-x-hidden">
          {/* Mobile Sidebar Trigger */}
          <div className="md:hidden mb-4">
            <SidebarTrigger />
          </div>

          {/* Full-width Main Content Wrapper */}
          <div className="w-full min-w-0 flex-1">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
