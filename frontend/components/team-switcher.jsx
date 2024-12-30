"use client";

import React, { useContext, useEffect, useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { UserContext } from "@/app/context/Context";
import axios from "axios";
import { BACKEND } from "@/constant/constant";

export function TeamSwitcher({ teams, parentEmail, checkAuth }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const { userInfo, currentKAM, leads, setLeads, setCurrKAM } =
    useContext(UserContext);

  // Fetch leads whenever the current KAM changes
  const fetchLeads = async () => {
    if (currentKAM?.KAM_ID) {
      try {
        const res = await axios.get(
          `${BACKEND}/leads/kam/${currentKAM.KAM_ID}`,
          {
            withCredentials: true,
          }
        );
        setLeads(res.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentKAM?.KAM_ID]);

  // Update KAM when a new KAM is selected
  const changeKam = (kam) => {
    setActiveTeam(kam);
    setCurrKAM({
      fullName: kam.fullName,
      KAM_ID: kam.KAM_ID,
    });
  };

  const [fullName, setFullName] = useState("");

  // State to control dialog open/close
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BACKEND}/add-kam`,
        {
          email: parentEmail, // Assuming parentEmail for the new KAM
          fullName,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        // After adding the KAM, fetch updated leads and teams
        checkAuth();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding KAM:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.fullName}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              KAMS
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.fullName}
                onClick={() => changeKam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.fullName}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setDialogOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div>Add KAM</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add KAM</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add KAM</DialogTitle>
            <DialogDescription>Provide KAM details below</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Full Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                className="col-span-3"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleSubmit}>Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
