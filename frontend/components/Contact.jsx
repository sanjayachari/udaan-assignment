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
import { UserContext } from "@/app/context/Context";
import axios from "axios";
import { BACKEND } from "@/constant/constant";
import { DialogClose } from "@radix-ui/react-dialog";
import { ContactPie } from "./ContactPie";

const ContactComp = () => {
  const { userInfo, currentKAM } = useContext(UserContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [leads, setLeads] = useState([]);
  const [openLead, setOpenLead] = useState(false);

  const handleSubmit = async (e) => {
    try {
      const res = await axios.post(
        `${BACKEND}/leads/${e}/contacts`,
        { name, phone, email, role },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === e
              ? { ...lead, contacts: [...lead.contacts, res.data.contact] }
              : lead
          )
        );
        setName("");
        setPhone("");
        setEmail("");
        setRole("");
        setOpenLead(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fun = async () => {
    if (currentKAM?.KAM_ID) {
      try {
        const res = await axios.get(
          `${BACKEND}/leads/kam/${currentKAM.KAM_ID}`,
          { withCredentials: true }
        );
        setLeads(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fun();
  }, [currentKAM?.KAM_ID, openLead]);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
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
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid md:grid-cols-3 gap-4 h-[800px]">
          {/* Lead List */}
          <div
            className={`col-span-2 min-h-[800px] rounded-xl bg-muted/50 ${
              leads.length > 0 ? "" : "flex items-center justify-center"
            }`}
          >
            {leads.length > 0 ? (
              <div className="p-3 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {leads.map((e, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between h-[250px] border border-black/30 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 rounded-md"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="text-slate-600">{e.name}</div>
                            <div className="text-red-500 text-[14px]">
                              {e.leadStatus}
                            </div>
                          </div>
                          <div className="h-[150px] flex items-center justify-center">
                            {e.contacts.length > 0 ? (
                              <div>{e.contacts.length} Contacts added</div>
                            ) : (
                              <div className="text-red-500">Add contacts</div>
                            )}
                          </div>
                        </div>
                      </DialogTrigger>

                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Lead Details</DialogTitle>
                          <DialogDescription>
                            Update or edit restaurant leads
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              value={name}
                              className="col-span-3"
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              value={email}
                              className="col-span-3"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              value={phone}
                              className="col-span-3"
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Role
                            </Label>
                            <Input
                              value={role}
                              className="col-span-3"
                              onChange={(e) => setRole(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              type="submit"
                              onClick={() => handleSubmit(leads[i]._id)}
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            ) : (
              "No leads have been added."
            )}
          </div>
          <div className="flex col-span-1 items-center justify-center h-[500px] rounded-xl bg-muted/50">
  {leads.length === 0 ? (
    <div>No Data</div>
  ) : (
    <ContactPie leads={leads} />
  )}
</div>

        </div>
      </div>
    </SidebarInset>
  );
};

export default ContactComp;
