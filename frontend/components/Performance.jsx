"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import axios from "axios";
import { UserContext } from "@/app/context/Context";
import { BACKEND } from "@/constant/constant";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Breadcrumb } from "antd";

const calculateMetrics = (data) => {
  let leadStatusCount = {
    "In Progress": 0,
    New: 0,
    Converted: 0,
  };

  let totalOrders = 0;
  let totalInteractions = 0;
  let leadPerformanceData = [];

  data.forEach((lead) => {
    // Count lead statuses
    if (leadStatusCount[lead.leadStatus] !== undefined) {
      leadStatusCount[lead.leadStatus] += 1;
    }

    // Count total orders value
    totalOrders += lead.orders.reduce((acc, order) => acc + order.value, 0);

    // Count total interactions
    totalInteractions += lead.interactions.length;

    // Collect data for bar chart (total orders and total interactions per lead)
    leadPerformanceData.push({
      name: lead.name,
      orders: lead.orders.reduce((acc, order) => acc + order.value, 0),
      interactions: lead.interactions.length,
    });
  });

  return {
    leadStatusCount,
    totalOrders,
    totalInteractions,
    leadPerformanceData,
  };
};

const Performance = () => {
  const [leadsData, setLeads] = useState([]);
  const { userInfo, currentKAM } = useContext(UserContext);

  const {
    leadStatusCount,
    totalOrders,
    totalInteractions,
    leadPerformanceData,
  } = calculateMetrics(leadsData);

  const leadStatusData = Object.entries(leadStatusCount).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const totalOrdersData = [{ name: "Total Orders", value: totalOrders }];

  const totalInteractionsData = [
    { name: "Total Interactions", value: totalInteractions },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const fun = async () => {
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
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fun();
  }, [currentKAM?.KAM_ID]);

  return (
    <SidebarInset>
      <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 ">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb
            items={[
              { title: 'Management', hidden: true },
              { title: 'Lead', separator: '>' },
            ]}
          />
        </div>
      </header>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lead Status Pie Chart */}
          <div className="aspect-video rounded-xl bg-muted/50">
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
                <CardDescription>
                  Pie chart showing distribution of lead statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart width={250} height={250}>
                  <Pie
                    data={leadStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {leadStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>

          {/* Total Orders Pie Chart */}
          <div className="aspect-video rounded-xl bg-muted/50">
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>
                  Pie chart showing total order value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart width={250} height={250}>
                  <Pie
                    data={totalOrdersData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {totalOrdersData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>

          {/* Total Interactions Pie Chart */}
          <div className="aspect-video rounded-xl bg-muted/50">
            <Card>
              <CardHeader>
                <CardTitle>Total Interactions</CardTitle>
                <CardDescription>
                  Pie chart showing total number of interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart width={250} height={250}>
                  <Pie
                    data={totalInteractionsData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {totalInteractionsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bar Chart for Lead Performance */}
        <div className="aspect-video rounded-xl bg-muted/50">
          <Card>
            <CardHeader>
              <CardTitle>Lead Performance (Orders & Interactions)</CardTitle>
              <CardDescription>
                Bar chart showing orders and interactions for each lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={leadPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Bar dataKey="orders" fill="#0088FE" name="Total Orders" />
                  <Bar
                    dataKey="interactions"
                    fill="#00C49F"
                    name="Total Interactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Performance;
