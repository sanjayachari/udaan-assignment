"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserContext } from "@/app/context/Context";
import { useContext, useEffect, useState } from "react";
import { BACKEND } from "@/constant/constant";
import axios from "axios";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }) {
  const { userInfo } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUserInfo, setCurrKAM } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND}/get-user`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setUserInfo(res.data);
          if (
            Array.isArray(res.data?.kams?.KAMS) &&
            res.data?.kams?.KAMS?.length > 0
          ) {
            setCurrKAM({
              fullName: res.data?.kams?.KAMS[0]?.fullName,
              KAM_ID: res.data?.kams?.KAMS[0]?._id,
            });
          }
          setLoading(false);
        } else {
          router.push("/login"); // Redirect to login
        }
      } catch (error) {
        router.push("/login"); // Redirect to login on error
      }
    };

    checkAuth();
  }, [router]);
  const data = {
    user: {
      name: userInfo?.kams?.KAMS?.[0]?.fullName || "san",
      email: userInfo?.kams?.KAMS?.[0]?.status || "active",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: Array.isArray(userInfo?.kams?.KAMS)
      ? userInfo.kams.KAMS.map((kam) => ({
          name: kam?.fullName || "Unknown",
          logo: GalleryVerticalEnd,
          plan: kam?.status || "active",
        }))
      : [],
    projects: [
      {
        name: "Lead Management",
        url: "/dashboard?route=lead",
        icon: Frame,
      },
      {
        name: "Contact Management",
        url: "/dashboard?route=contact",
        icon: PieChart,
      },
      {
        name: "Interaction Tracking",
        url: "/dashboard?route=interaction",
        icon: PieChart,
      },
      {
        name: "Call Planning",
        url: "/dashboard?route=call",
        icon: PieChart,
      },
      {
        name: "Performance Tracking",
        url: "/dashboard?route=performance",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
