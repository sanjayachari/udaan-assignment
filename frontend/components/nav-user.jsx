"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND } from "@/constant/constant";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    try {
     const res = await axios.post(`${BACKEND}/logout`, // Adjust the endpoint if needed
        {},
        { withCredentials: true } // Ensure cookies are sent with the request
      );
      console.log('res',res.data)
      router.push("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="">
        <div
          onClick={handleLogout}
          className="cursor-pointer p-2 rounded-md flex-1 flex items-center justify-center text-left text-sm leading-tight border border-red-500 shadow-md w-full"
        >
          <span className="truncate font-semibold">Logout</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
