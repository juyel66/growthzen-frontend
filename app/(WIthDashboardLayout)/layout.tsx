// src/app/(WithDashboardLayout)/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        {/* MAIN CONTENT FIXED */}
        <main className="flex-1 w-full flex justify-center items-start p-6">
          
          {/* Trigger stays on top-left */}
          <div className="absolute left-4 top-4">
            <SidebarTrigger />
          </div>

          {/* Centered content wrapper */}
          <div className="w-full ">
            {children}
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
}

