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
import { LeadPie } from "./LeadPie";
import Loading from "./Loading";

const Lead = () => {
  const { userInfo, currentKAM } = useContext(UserContext);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [email, setEmail] = useState("");
  const [kamId, setKamId] = useState("");
  const [fullName, setFullname] = useState("");

  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [openLead, setOpenLead] = useState(false); // State to manage dialog visibility
  const [loadComp,setLoadComp] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND}/leads`,
        {
          name,
          address,
          email: userInfo?.kams?.email,
          leadStatus: "New",
          fullName: currentKAM?.fullName,
          kamId: currentKAM.KAM_ID,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        setOpenLead(false); // Close the dialog after submitting
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fun = async () => {
    setLoadComp(true)
    if (currentKAM?.KAM_ID) {
      try {
        const res = await axios.get(
          `${BACKEND}/leads/kam/${currentKAM.KAM_ID}`,
          {
            withCredentials: true,
          }
        );
        setLoadComp(false)
        setLeads(res.data);

      } catch (error) {
        console.error(error);
        setLoadComp(false); // In case of error, stop loading

      }
    }
  };

  useEffect(() => {
    fun();
  }, [currentKAM?.KAM_ID, openLead]);

  const handleUpdateSubmit = async (lead) => {
    try {
      const res = await axios.put(
        `${BACKEND}/leads`,
        {
          leadId: lead._id, // Ensure lead object has an `id`
          name: lead.name,
          address: lead.address,
          leadStatus: lead.leadStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setOpen(false); // Close the dialog after submitting

        alert("Lead updated successfully!");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update lead.");
    }
  };

  if(loadComp){
    return <Loading/>
  }

  return (
    <SidebarInset>
      <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
        <div className="grid auto-rows-min gap-4 md:grid-cols-3  h-[800px] p-2">
          <div
            className={`grid col-span-2 h-[800px] rounded-xl bg-muted/50  ${
              leads.length > 0 ? "" : "items-center justify-center"
            } `}
          >
            {leads.length > 0 ? (
              <div className="p-3 cursor-pointer">
                {leads.map((e, i) => (
                  <div
                    key={i}
                    className="my-2 w-full border border-black/30 hover:shadow-2xl transition-all duration-600 p-3 rounded-md flex justify-between items-center"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <DialogTitle className="w-full">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-slate-600">{e.name}</div>
                            <div className="text-red-500 text-[14px]">
                              {e.leadStatus}
                            </div>
                          </div>
                        </DialogTitle>
                      </DialogTrigger>

                      <DialogContent className="w-full">
                        <DialogHeader>
                          <DialogTitle>Lead Details</DialogTitle>
                          <DialogDescription>
                            Update or edit restaurant leads
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                          {/* Name Input */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              value={e.name}
                              className="col-span-3"
                              onChange={(event) => {
                                const updatedLeads = [...leads];
                                updatedLeads[i].name = event.target.value;
                                setLeads(updatedLeads);
                              }}
                            />
                          </div>

                          {/* Address Input */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                              Address
                            </Label>
                            <Input
                              value={e.address}
                              className="col-span-3"
                              onChange={(event) => {
                                const updatedLeads = [...leads];
                                updatedLeads[i].address = event.target.value;
                                setLeads(updatedLeads);
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              value={e.name}
                              className="col-span-3"
                              onChange={(event) => {
                                const updatedLeads = [...leads];
                                updatedLeads[i].name = event.target.value;
                                setLeads(updatedLeads);
                              }}
                            />
                          </div>

                          {/* Status Radio Buttons */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <div className="col-span-3 flex space-x-6">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`option-${i}`}
                                  value="New"
                                  checked={e.leadStatus === "New"}
                                  onChange={() => {
                                    const updatedLeads = [...leads];
                                    updatedLeads[i].leadStatus = "New";
                                    setLeads(updatedLeads);
                                  }}
                                  className="mr-2"
                                />
                                <span>New</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`option-${i}`}
                                  value="In Progress"
                                  checked={e.leadStatus === "In Progress"}
                                  onChange={() => {
                                    const updatedLeads = [...leads];
                                    updatedLeads[i].leadStatus = "In Progress";
                                    setLeads(updatedLeads);
                                  }}
                                  className="mr-2"
                                />
                                <span>In Progress</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`option-${i}`}
                                  value="Converted"
                                  checked={e.leadStatus === "Converted"}
                                  onChange={() => {
                                    const updatedLeads = [...leads];
                                    updatedLeads[i].leadStatus = "Converted";
                                    setLeads(updatedLeads);
                                  }}
                                  className="mr-2"
                                />
                                <span>Converted</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              type="submit"
                              onClick={() => handleUpdateSubmit(leads[i])}
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
                        value={name}
                        className="col-span-3"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Address
                      </Label>
                      <Input
                        value={address}
                        className="col-span-3"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit" onClick={handleSubmit}>
                        Save changes
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex col-span-1 items-center justify-center h-full rounded-xl bg-muted/50">
  {leads.length === 0 ? (
    <div>No Data</div> 
  ) : (
    <LeadPie leads={leads} />  
  )}
</div>

          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Lead;
