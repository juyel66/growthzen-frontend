"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wand2,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Settings,
  LogOut,
  ListOrdered,
  FolderTree,
  Ticket,
  Truck,
  Star,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  PackageSearch,
  UserCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/services/authApi";
import { baseApi } from "@/services/baseApi";
import Swal from "sweetalert2";

// Enterprise Admin Menu Taxonomy
const mainAdminItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard/dashboard",
    icon: Home,
  },
  {
    title: "Categories",
    url: "/admin-dashboard/products/categories",
    icon: FolderTree,
  },
  {
    title: "Products",
    url: "/admin-dashboard/products",
    icon: Wand2,
  },
  {
    title: "Orders",
    url: "/admin-dashboard/orders",
    icon: ListOrdered,
  },
  {
    title: "Payments",
    url: "/admin-dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Customers",
    url: "/admin-dashboard/customers",
    icon: Users,
  },
  {
    title: "Shipping",
    url: "/admin-dashboard/shipping",
    icon: Truck,
  },
  {
    title: "Coupons",
    url: "/admin-dashboard/coupons",
    icon: Ticket,
  },
  {
    title: "Reviews",
    url: "/admin-dashboard/reviews",
    icon: Star,
  },
];

const analyticsSubItems = [
  {
    title: "Revenue Analytics",
    url: "/admin-dashboard/analytics/revenue",
    icon: TrendingUp,
  },
  {
    title: "Order Analytics",
    url: "/admin-dashboard/analytics/orders",
    icon: ListOrdered,
  },
  {
    title: "Customer Analytics",
    url: "/admin-dashboard/analytics/customers",
    icon: UserCheck,
  },
  {
    title: "Product Analytics",
    url: "/admin-dashboard/analytics/products",
    icon: PackageSearch,
  },
  {
    title: "Payment Analytics",
    url: "/admin-dashboard/analytics/payments",
    icon: CreditCard,
  },
];

const bottomAdminItems = [
  {
    title: "Reports",
    url: "/admin-dashboard/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
];

const ACTIVE_BG = "#2D6FF8";
const ACTIVE_TEXT = "#FFFFFF";
const INACTIVE_TEXT = "#4B5563";
const INACTIVE_ICON = "#6B7280";

export function AppSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const isAnalyticsActive = pathname?.startsWith("/admin-dashboard/analytics");
  const [analyticsOpen, setAnalyticsOpen] = useState<boolean>(isAnalyticsActive || false);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore network errors on logout API call
    } finally {
      dispatch(logOut());
      dispatch(baseApi.util.resetApiState());
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      router.push("/auth/login");
    }
  };

  return (
    <Sidebar className="border-r bg-white pr-2">
      <SidebarContent className="flex h-full flex-col justify-between py-4">
        {/* TOP: Logo + Navigation */}
        <div className="overflow-y-auto pr-1">
          {/* Logo Area */}
          <div>
            <div className="flex items-center gap-2 px-4">
              <Image
                src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1785603633/ChatGPT_Image_Aug_1_2026_10_56_41_PM_1_vd6zar.png"
                alt="GrowthZen Logo"
                width={180}
                height={180}
                className="h-[50px] w-[200px]"
              />
            </div>
            <p className="border-b px-[50px] pb-2 text-[9px] text-[#A7B2C3]">
              Enterprise Ecommerce Admin
            </p>
          </div>

          {/* Navigation Links */}
          <SidebarGroup className="mt-3">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {/* Main Menu Items */}
                {mainAdminItems.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="rounded-xl font-semibold transition-colors duration-150"
                        style={{
                          backgroundColor: isActive ? ACTIVE_BG : "transparent",
                          color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT,
                        }}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-[18px]"
                        >
                          <Icon
                            className="h-[18px] w-[18px]"
                            style={{
                              color: isActive ? ACTIVE_TEXT : INACTIVE_ICON,
                            }}
                          />
                          <span className="text-[14px] font-[500]">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* Analytics Submenu Header */}
                <SidebarMenuItem>
                  <button
                    onClick={() => setAnalyticsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-[14px] text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    style={{
                      backgroundColor: isAnalyticsActive ? "#EEF3FF" : "transparent",
                      color: isAnalyticsActive ? ACTIVE_BG : INACTIVE_TEXT,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3
                        className="h-[18px] w-[18px]"
                        style={{
                          color: isAnalyticsActive ? ACTIVE_BG : INACTIVE_ICON,
                        }}
                      />
                      <span className="font-semibold">Analytics</span>
                    </div>
                    {analyticsOpen ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </SidebarMenuItem>

                {/* Analytics Submenu Children */}
                {analyticsOpen && (
                  <div className="pl-6 space-y-1 my-1 border-l-2 border-slate-100 ml-5">
                    {analyticsSubItems.map((sub) => {
                      const isSubActive = pathname === sub.url;
                      const SubIcon = sub.icon;

                      return (
                        <Link
                          key={sub.title}
                          href={sub.url}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: isSubActive ? ACTIVE_BG : "transparent",
                            color: isSubActive ? ACTIVE_TEXT : INACTIVE_TEXT,
                          }}
                        >
                          <SubIcon
                            className="h-3.5 w-3.5"
                            style={{
                              color: isSubActive ? ACTIVE_TEXT : INACTIVE_ICON,
                            }}
                          />
                          <span>{sub.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Admin Items (Reports & Settings) */}
                {bottomAdminItems.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="rounded-xl font-semibold transition-colors duration-150"
                        style={{
                          backgroundColor: isActive ? ACTIVE_BG : "transparent",
                          color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT,
                        }}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-[18px]"
                        >
                          <Icon
                            className="h-[18px] w-[18px]"
                            style={{
                              color: isActive ? ACTIVE_TEXT : INACTIVE_ICON,
                            }}
                          />
                          <span className="text-[14px] font-[500]">
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
        </div>

        {/* BOTTOM: Logout */}
        <div className="mt-2 border-t border-gray-100 pt-3">
          <button
            onClick={handleLogout}
            className="mx-4 flex w-[calc(100%-2rem)] items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#EF4444] hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
