// export const metadata = {
//     title: "Dashboard",
//   };

//   export default function DashboardLayout({ children }) {
//     return (
//       <div>
//         {/* Sidebar or Persistent UI */}
//         <aside style={{ width: "250px", float: "left", background: "#f4f4f4" }}>
//           <nav>
//             <ul>
//               <li>
//                 <a href="/test/overview">Overview</a>
//               </li>
//               <li>
//                 <a href="/dashboard/settings">Settings</a>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content Area */}
//         <main style={{ marginLeft: "250px", padding: "20px" }}>
//           {children}
//         </main>
//       </div>
//     );
//   }

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

const Dashboard = ({children}) => {
  const { userInfo } = useContext(UserContext);

  const searchParams = useSearchParams();
  const [route, setRoute] = useState("");

  //   useEffect(() => {
  //     const routeParam = searchParams.get("route");
  //     setRoute(routeParam);
  //   }, [searchParams]);

  //   const renderComponent = () => {
  //     switch (route) {
  //       case "lead":
  //         return <Lead />;
  //       case "contact":
  //         return <ContactComp />;
  //       case "interaction":
  //         return <Interaction />;
  //           case "call":
  //         return <CallComp />;
  //                case "performance":
  //         return <Performance />;
  //       default:
  //         return <Lead />;
  //     }
  //   };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        {/* {renderComponent()} */}
      </SidebarProvider>
      <main style={{ marginLeft: "250px", padding: "20px" }}>
        {children}
      
      </main>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
