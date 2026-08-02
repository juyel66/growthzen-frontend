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
  ListOrdered,
  UserCheck2Icon,
  FolderTree,
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
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/services/authApi";
import { baseApi } from "@/services/baseApi";
import Swal from "sweetalert2";

// ---- MENU ITEMS ----

// User menu items (your current design)
const userItems = [


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

// Admin menu items (matching the admin screenshot)
const adminItems = [





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
    title: "Shipping",
    url: "/admin-dashboard/shipping",
    icon: BarChart3,
  },
  {
    title: "Customers",
    url: "/admin-dashboard/customers",
    icon: Users,
  },
  {
    title: "User Management",
    url: "/admin-dashboard/user-management",
    icon: UserCheck2Icon,
  },
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
  {
    title: "Profile",
    url: "/admin-dashboard/profile",
    icon: CgProfile,
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const items = isAdmin ? adminItems : adminItems;

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore network errors on logout API call
    } finally {
      dispatch(logOut());
      dispatch(baseApi.util.resetApiState());
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
      router.push('/auth/login');
    }
  };

  return (
    <Sidebar className="border-r bg-white pr-2">
      <SidebarContent className="flex h-full flex-col justify-between py-4">
        {/* TOP: Logo + menu */}
        <div>
          {/* Logo area */}
       <div>   <div className="flex items-center gap-2 px-4">


            <Image
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1785603633/ChatGPT_Image_Aug_1_2026_10_56_41_PM_1_vd6zar.png"
              alt="GrowthZen Logo"
              width={180}
              height={180}
              className="h-[50px] w-[200px]"
            />


          </div>

          <p className="border-b px-[50px] pb-2 text-[9px] text-[#A7B2C3]">Grow Your Business with Us</p>
</div>

          {/* Navigation Links */}
          <SidebarGroup className="mt-4">
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="rounded-xl font-[#A7B2C3] font-semibold transition-colors duration-150"
                        style={{
                          backgroundColor: isActive ? ACTIVE_BG : "transparent",
                          color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT,
                        }}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-[20px]"
                        >
                          <Icon
                            className="h-[20px] w-[20px]"
                            style={{
                              color: isActive ? ACTIVE_TEXT : INACTIVE_ICON,
                            }}
                          />
                          <span className="text-[15px] font-[500]">
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
