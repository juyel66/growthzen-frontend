"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Megaphone,
  Wand2,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Settings,
  LogOut,
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
} from "@/components/ui/sidebar";
import Image from "next/image";

// ---- MENU ITEMS ----

// User menu items (your current design)
const userItems = [
  {
    title: "Dashboard",
    url: "/user-dashboard/dashboard",
    icon: Home,
  },
  {
    title: "Campaigns",
    url: "/user-dashboard/campaigns",
    icon: Megaphone,
  },
  {
    title: "AI Tools",
    url: "/user-dashboard/ai-tools",
    icon: Wand2,
  },
  {
    title: "Analytics",
    url: "/user-dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    url: "/user-dashboard/reports",
    icon: FileText,
  },
  {
    title: "Subscription",
    url: "/user-dashboard/subscription",
    icon: CreditCard,
  },
  {
    title: "Team",
    url: "/user-dashboard/team",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/user-dashboard/settings",
    icon: Settings,
  },
];

// Admin menu items (matching the admin screenshot)
const adminItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    url: "/admin-dashboard/user-management",
    icon: Users,
  },
  {
    title: "Campaigns Monitoring",
    url: "/admin-dashboard/campaigns-monitoring",
    icon: Megaphone,
  },
  {
    title: "Content Moderation",
    url: "/admin-dashboard/content-moderation",
    icon: FileText,
  },
  {
    title: "Finance",
    url: "/admin-dashboard/finance",
    icon: CreditCard,
  },
  {
    title: "Platform Analytics",
    url: "/admin-dashboard/platform-analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
];

// colors from your design
const ACTIVE_BG = "#2D6FF8";
const ACTIVE_TEXT = "#FFFFFF";
const INACTIVE_TEXT = "#4B5563"; // gray-700
const INACTIVE_ICON = "#6B7280"; // gray-600
const HOVER_BG = "#EEF3FF"; // light bluish

// 👇 UPDATED: accept isAdmin prop and choose items based on that
export function AppSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? adminItems : userItems;

  return (
    <Sidebar className="border-r bg-white pr-2">
      <SidebarContent className="flex h-full flex-col justify-between py-4">
        {/* TOP: Logo + menu */}
        <div>
          {/* Logo area */}
       <div>   <div className="flex items-center gap-2 px-4">


            <Image
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              width={160}
              height={160}
              className="h-[66px] w-[200]"
            />


          </div></div>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {/* empty label to match spacing */}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive =
                    pathname === item.url || pathname.startsWith(item.url + "/");

                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group mx-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#2D6FF8] text-white shadow-sm"
                            : "text-[var(--inactive-text)] hover:bg-[var(--hover-bg)]"
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundColor: ACTIVE_BG,
                                color: ACTIVE_TEXT,
                              }
                            : {
                                color: INACTIVE_TEXT,
                              }
                        }
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3"
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{
                              color: isActive ? ACTIVE_TEXT : INACTIVE_ICON,
                            }}
                          />
                          <span
                            className="truncate"
                            style={{
                              color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT,
                            }}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Plan card (you can hide this for admin if you want using isAdmin) */}
       
        </div>

        {/* BOTTOM: Logout */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <button className="mx-4 flex w-[calc(100%-2rem)] items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#EF4444] hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
