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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MdAddCall } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { PhoneIcon, ShoppingCartIcon } from "lucide-react";

const CallComp = () => {
  const { userInfo, currentKAM } = useContext(UserContext);
  const searchParams = useSearchParams();

  const [leadId, setLeadId] = useState("");
  const [leads, setLeads] = useState(null); // Single lead object
  const [openLead, setOpenLead] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [conversation, setConversation] = useState("");

  const [callHistory, setCallHistory] = useState([]);

  const fun = async () => {
    if (currentKAM?.KAM_ID) {
      console.log('render')
      try {
        const res = await axios.get(
          `${BACKEND}/remaining-leads/kam/${currentKAM.KAM_ID}`,
          {
            withCredentials: true,
          }
        );
        setLeads(res.data);
      console.log('render')

        const callHistoryRes = await axios.get(
          `${BACKEND}/call-history-leads/kam/${currentKAM.KAM_ID}`,
          {
            withCredentials: true,
          }
        );
        setCallHistory(callHistoryRes.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fun();
  }, [currentKAM?.KAM_ID]);

  const handleSubmit = async (leadId) => {
    try {
      const res = await axios.post(
        `${BACKEND}/leads/${leadId}/interactions`,
        {
          summary: conversation,
          type: "KAM-to-lead",
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        if (res.status === 201) {
          setConversation("");
          fun(leadId);
        }
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  // useEffect(() => {
  //   const subParam = searchParams.get("sub");
  //   if (subParam) {
  //     setLeadId(subParam);
  //     fetchLeadDetails(subParam);
  //   }
  // }, [searchParams]);

  // State hooks to manage form values
  const [quantity, setQuantity] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [orderProd, setOrderProd] = useState("");

  const [callFrequency, setCallFrequency] = useState(""); // State to track selected call frequency

  // Function to handle radio button change
  const handleCallFrequencyChange = (e) => {
    setCallFrequency(e.target.value); // Update state when a radio button is selected
  };

  // Function to handle the POST request on button click
  const handleSaveCallFreq = async (leadId) => {
    if (!callFrequency) {
      alert("Please select a call frequency!");
      return;
    }

    try {
      // Send POST request to your server
      const res = await axios.post(
        `${BACKEND}/leads/${leadId}/callFrequency`,
        { frequency: callFrequency },
        {
          withCredentials: true,
        }
      );
      console.log("res", res.data);
      if (res.status === 200) {
        // alert("Call frequency updated successfully!");
      } else {
        alert("Failed to update call frequency");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating call frequency");
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <Link href={"/dashboard?route=interaction"}>
                <BreadcrumbItem>
                  <BreadcrumbPage>Lead</BreadcrumbPage>
                </BreadcrumbItem>
              </Link>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Contacts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 h-[800px] p-2">
          <div
            className={`p-3 grid col-span-2 min-h-[800px] rounded-xl ${
              leads?.length > 0 ? "" : "items-center justify-center"
            }`}
          >
            {leads?.length > 0 ? (
              <div className="">
                {leads.map((e, i) => (
                  <div
                    key={i}
                    className="w-full cursor-pointer p-4 rounded-md bg-muted/50 my-3 shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center w-full">
                      {/* Lead Details */}
                      <div>
                        <div className="text-slate-600 font-medium text-lg">
                          {e.name}
                        </div>
                        <div className="text-gray-500 text-sm">{e.address}</div>
                      </div>
                      {/* Lead Status */}
                      <div className="text-red-500 text-sm">{e.leadStatus}</div>
                    </div>
                    {/* Icons for Call and Cart */}
                    <div className="flex gap-3 mt-4 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <PhoneIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full">
                          <DialogHeader>
                            <DialogTitle>Lead Details</DialogTitle>
                            <DialogDescription>
                              Update or edit contact details.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid gap-6">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Conversation
                              </Label>
                              <Input
                                value={conversation}
                                className="col-span-3"
                                onChange={(e) =>
                                  setConversation(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                type="submit"
                                onClick={() => handleSubmit(e._id)}
                              >
                                Save changes
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <ShoppingCartIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full">
                          <DialogHeader>
                            <DialogTitle>Call Frequency</DialogTitle>
                            <DialogDescription>
                              Set the call frequency for the lead.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-6 py-4">
                            {/* Call Frequency Input */}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="callFrequency"
                                className="text-right"
                              >
                                Call Frequency
                              </Label>
                              <div className="col-span-3 flex items-center">
                                <div className="flex items-center mr-4">
                                  <input
                                    type="radio"
                                    id="1Day"
                                    name="callFrequency"
                                    value="Daily"
                                    className="mr-2"
                                    onChange={handleCallFrequencyChange}
                                  />
                                  <Label
                                    htmlFor="1Day"
                                    className="text-gray-600"
                                  >
                                    1 Day
                                  </Label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="1Week"
                                    name="callFrequency"
                                    value="Weekly"
                                    className="mr-2"
                                    onChange={handleCallFrequencyChange}
                                  />
                                  <Label
                                    htmlFor="1Week"
                                    className="text-gray-600"
                                  >
                                    1 Week
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                type="submit"
                                onClick={() => handleSaveCallFreq(e._id)} // Trigger POST request on button click
                              >
                                Save Changes
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              "No leads have been added."
            )}
          </div>
          <div className="grid auto-col-min gap-4 md:grid-cols-1">
            <div className="h-[500px] rounded-xl bg-muted/50 p-6">
              <div className="text-2xl font-bold text-gray-800 mb-6">
                Call history
              </div>
              <div className="w-full h-[400px] overflow-scroll scrollbar-hide">
                {callHistory?.length > 0 ? (
                  callHistory?.map((lead, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Lead: {lead.name}
                      </h3>
                      {lead.interactions.map((interaction, idx) => (
                        <div
                          key={idx}
                          className="border-b border-gray-300 pb-4 mb-4 last:border-none"
                        >
                          <p className="text-gray-600">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(interaction.date).toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Summary:</span>{" "}
                            {interaction.summary}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Outcome:</span>{" "}
                            {interaction.outcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic text-center">
                    No history available
                  </div>
                )}
              </div>
            </div>

            <div className="grid auto-cols-min gap-4 md:grid-cols-1">
              <div className="h-[500px] rounded-xl bg-muted/50 p-6">
                <div className="text-xl font-bold text-gray-800 mb-4">
                  Last call
                </div>
                <div className="w-full h-[400px] overflow-scroll scrollbar-hide">
                  {callHistory?.length > 0 ? (
                    // Sort the callHistory array by lastCall field, descending (most recent first)
                    <div
                      key={callHistory[0]?._id} // Use the first item after sorting as the key
                      className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Lead:{" "}
                        {
                          callHistory.sort(
                            (a, b) =>
                              new Date(b.lastCall) - new Date(a.lastCall)
                          )[0]?.name
                        }
                      </h3>
                      {/* Reverse the interactions, and then select the first one (most recent) */}
                      {callHistory
                        .sort(
                          (a, b) => new Date(b.lastCall) - new Date(a.lastCall)
                        )[0]
                        ?.interactions.reverse() // Reverse interactions to get the most recent one first
                        .filter(
                          (interaction) => interaction.type === "KAM-to-lead"
                        )
                        .slice(0, 1) // Get only the first interaction after reversing
                        .map((interaction, idx) => (
                          <div
                            key={idx}
                            className="border-b border-gray-300 pb-4 mb-4 last:border-none"
                          >
                            <p className="text-gray-600">
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(interaction.date).toLocaleString()}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Summary:</span>{" "}
                              {interaction.summary}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Outcome:</span>{" "}
                              {interaction.outcome}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center">
                      No history available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default CallComp;
