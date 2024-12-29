import React, { useContext, useEffect, useState } from "react";
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
import { UserContext } from "@/app/context/Context";
import axios from "axios";
import { BACKEND } from "@/constant/constant";
import Link from "next/link";
import { ContactPie } from "./ContactPie";
import { InteractionPie } from "./InteractionPie";

const Interaction = () => {
  const { currentKAM } = useContext(UserContext);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads based on KAM ID
  const fetchLeads = async () => {
    if (!currentKAM?.KAM_ID) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND}/leads/kam/${currentKAM.KAM_ID}`,
        { withCredentials: true }
      );
      setLeads(res.data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentKAM?.KAM_ID]);

  return (
    <SidebarInset>
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Lead</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid md:grid-cols-3 gap-4 h-[800px]">
          {/* Lead List */}
          <div
            className={`col-span-2 min-h-[800px] rounded-xl bg-muted/50 ${
              leads.length > 0 ? "" : "flex items-center justify-center"
            }`}
          >
            {loading ? (
              <div>Loading leads...</div>
            ) : leads.length > 0 ? (
              <div className="grid gap-6 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                {leads.map((lead, index) => (
                  <Link
                    key={index}
                    href={`/dashboard?route=interaction&sub=${lead._id}`}
                    className="flex flex-col justify-between border border-black/30 bg-white shadow-sm hover:shadow-lg transition-shadow p-4 rounded-md"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="text-slate-600">{lead.name}</div>
                        <div className="text-red-500 text-sm">
                          {lead.leadStatus}
                        </div>
                      </div>
                      <div className="flex items-center justify-center h-40">
                        {lead.contacts.length > 0 ? (
                          <div>{lead.contacts.length} - Contacts added</div>
                        ) : (
                          <div className="text-red-500">No contacts</div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              "No leads have been added."
            )}
          </div>

          {/* Analytics */}
          <div className="col-span-1 flex items-center justify-center h-[500px] rounded-xl bg-muted/50">
            <InteractionPie leads={leads} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Interaction;
