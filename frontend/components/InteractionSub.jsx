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

const InteractionSub = () => {
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

  const fetchLeadDetails = async (subParam) => {
    try {
      const res = await axios.get(`${BACKEND}/leads/${subParam}`, {
        withCredentials: true,
      });
      console.log("Fetched lead data:", res.data);
      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching lead:", error);
    }
  };

  const handleSubmit = async (leadId) => {
    try {
      const res = await axios.post(
        `${BACKEND}/leads/${leadId}/interactions`,
        {
          summary: conversation,
          type: "Lead-to-POC",
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        if (res.status === 201) {
          setConversation("");
          fetchLeadDetails(leadId);
        }
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  useEffect(() => {
    const subParam = searchParams.get("sub");
    if (subParam) {
      setLeadId(subParam);
      fetchLeadDetails(subParam);
    }
  }, [searchParams]);

  // State hooks to manage form values
  const [quantity, setQuantity] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [orderProd, setOrderProd] = useState("");

  // Function to handle "Save Changes"
  const handleSaveChanges = async (name, role) => {
    const payload = {
      quantity,
      value,
      date,
      name,
      role,
      orderName: orderProd,
    };

    console.log("Payload:", payload);

    // Add your API call or logic here
    if (!orderProd || !quantity || !value || !date) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND}/leads/${leadId}/orders`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log("res", res.data);
      if (res.status === 201) {
        setQuantity("");
        setValue("");
        setDate("");
        setOrderProd("");
        fetchLeadDetails(leadId);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
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
            className={` p-3 grid col-span-2 min-h-[800px] rounded-xl bg-muted/50 ${
              leads ? "" : "items-center justify-center"
            }`}
          >
            {leads ? (
              <>
                <div className="w-full cursor-pointer p-4 rounded-md">
                  <div className="flex justify-between items-start w-full">
                    <div className="text-slate-600 font-medium">
                      {leads.name}
                    </div>
                    <div className="text-red-500 text-sm">
                      {leads.leadStatus}
                    </div>
                  </div>
                  <div className="grid gap-4 mt-4">
                    {leads.contacts.length > 0 ? (
                      leads.contacts.map((item, k) => (
                        <div
                          key={k}
                          className="flex justify-between items-center mb-2 text-sm border border-red-500 border-opacity-50 shadow-xl p-3 rounded-md"
                        >
                          <div>
                            <div className="font-semibold">
                              Name : {item.name}
                            </div>
                            <div> Email : {item.email}</div>
                            <div> Role : {item.role}</div>
                          </div>
                          <div className="flex gap-3 text-2xl">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <MdAddCall />
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
                                    <Label
                                      htmlFor="name"
                                      className="text-right"
                                    >
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
                                      onClick={() => handleSubmit(leadId)}
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
                                  <FaCartArrowDown />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-full">
                                <DialogHeader>
                                  <DialogTitle>Cart Details</DialogTitle>
                                  <DialogDescription>
                                    View or update the cart details.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="quantity"
                                      className="text-right"
                                    >
                                      name
                                    </Label>
                                    <Input
                                      id="name"
                                      type="text"
                                      className="col-span-3"
                                      placeholder="Enter quantity"
                                      value={orderProd}
                                      onChange={(e) =>
                                        setOrderProd(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="quantity"
                                      className="text-right"
                                    >
                                      Quantity
                                    </Label>
                                    <Input
                                      id="quantity"
                                      type="number"
                                      className="col-span-3"
                                      placeholder="Enter quantity"
                                      value={quantity}
                                      onChange={(e) =>
                                        setQuantity(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="value"
                                      className="text-right"
                                    >
                                      Value
                                    </Label>
                                    <Input
                                      id="value"
                                      type="number"
                                      className="col-span-3"
                                      placeholder="Enter value"
                                      value={value}
                                      onChange={(e) => setValue(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="date"
                                      className="text-right"
                                    >
                                      Date
                                    </Label>
                                    <Input
                                      id="date"
                                      type="date"
                                      className="col-span-3"
                                      value={date}
                                      onChange={(e) => setDate(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      type="submit"
                                      onClick={async () => {
                                        await handleSaveChanges(
                                          item.name,
                                          item.role
                                        );
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-red-500 text-sm">
                        No contacts added.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              "No leads have been added."
            )}
          </div>
          <div className="grid auto-col-min gap-4 md:grid-cols-1">
            <div className="h-[500px] rounded-xl bg-muted/50 p-6">
              <div className="text-xl font-bold text-gray-800 mb-6">Orders</div>
              <div className="w-full h-[400px] overflow-scroll scrollbar-hide">
                {leads?.orders?.length > 0 ? (
                  <div className="space-y-4">
                    {leads.orders
                      .slice()
                      .reverse()
                      .map((e, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="text-gray-600">
                            <span className="font-medium">Order:</span>{" "}
                            {e.orderName}
                          </div>

                          <div className="text-gray-600">
                            <span className="font-medium">Name:</span> {e.name}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Quantity:</span>{" "}
                            {e.quantity}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Price:</span>{" "}
                            {e.value * e.quantity}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Role:</span> {e.role}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(e.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-center">
                    No orders available
                  </div>
                )}
              </div>
            </div>
            <div className="grid auto-cols-min gap-4 md:grid-cols-1">
              <div className="h-[500px] rounded-xl bg-muted/50 p-6">
                <div className="text-xl font-bold text-gray-800 mb-4">
                  Interactions
                </div>
                <div className="w-full h-[400px] overflow-scroll scrollbar-hide">
                  {leads?.interactions?.length > 0 ? (
                    <div className="space-y-4">
                      {leads.interactions
                       .filter(interaction => interaction.type === "Lead-to-POC")
                        .slice()
                        .reverse()
                        .map((interaction, i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                          >
                            <div className="text-gray-600">
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(interaction.date).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Summary:</span>{" "}
                              {interaction.summary}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Outcome:</span>{" "}
                              {interaction.outcome}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center">
                      No interactions available
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

export default InteractionSub;
