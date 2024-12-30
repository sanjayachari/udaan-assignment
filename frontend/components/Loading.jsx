import React, { useState, useEffect } from "react";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

const Loading = () => {
  const [openLead, setOpenLead] = useState(false); // State to manage dialog visibility
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Simulate loading for 3 seconds (you can adjust the time)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set to false after 3 seconds to simulate data loaded
    }, 3000);
  }, []);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 ">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Lead</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 h-[800px] p-2">
          <div className={`grid col-span-2 h-[800px] rounded-xl bg-muted/50`}>
            {isLoading ? (
              <div className="p-3 cursor-pointer">
                {/* Skeleton Loader for list items */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="my-2 w-full border border-black/30 hover:shadow-2xl transition-all duration-600 p-3 rounded-md flex justify-between items-center"
                  >
                    <div className="w-full flex justify-between items-center">
                      {/* Skeleton text */}
                      <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
                      <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              "No leads have been added."
            )}
          </div>
          <div className="grid auto-col-min gap-4 md:grid-cols-1">
            <div className="flex col-span-1 items-center justify-center h-full rounded-xl bg-muted/50">
              <Dialog open={openLead} onOpenChange={setOpenLead}>
                <DialogTrigger asChild>
                  <Button variant="outline">Add restaurant lead</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add restaurant lead</DialogTitle>
                    <DialogDescription>
                      Keep the description concise and engaging
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        value=""
                        className="col-span-3"
                        onChange={() => {}}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Address
                      </Label>
                      <Input
                        value=""
                        className="col-span-3"
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">Save changes</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex col-span-1 items-center justify-center h-full rounded-xl bg-muted/50">
              {/* Skeleton Loader for Pie Chart */}
              <div className="h-64 w-full bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Loading;
