"use client";
import ProtectedRoute from "@/routeProtect/RouteProtect";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";
import { useRouter, useSearchParams } from "next/navigation";
import Lead from "@/components/lead";
import ContactComp from "@/components/Contact";
import Interaction from "@/components/Interaction";
import CallComp from "@/components/CallComp";
import Performance from "@/components/Performance";
import InteractionSub from "@/components/InteractionSub";

const Dashboard = () => {
  const { userInfo } = useContext(UserContext);

  const searchParams = useSearchParams();
  const [route, setRoute] = useState("");
  const [routeSub, setRouteSub] = useState("");

  useEffect(() => {
    const routeParam = searchParams.get("route");
    const subParam = searchParams.get("sub");
    console.log("routeParam", routeParam, subParam);
    setRoute(routeParam);
    setRouteSub(subParam);
  }, [searchParams]);

  const renderComponent = () => {
    switch (route) {
      case "lead":
        return <Lead />;
      case "contact":
        return <ContactComp />;
      case "interaction":
        return  route && routeSub ? <InteractionSub /> : <Interaction />;
      case "call":
        return <CallComp />;
      case "performance":
        return <Performance />;
      default:
        return <Lead />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      {renderComponent()}
    </SidebarProvider>
  );
};

export default ProtectedRoute(Dashboard);
