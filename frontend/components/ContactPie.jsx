"use client";

import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ContactPie({ leads = [] }) {
  const chartConfig = {
    New: { label: "New", color: "hsl(var(--chart-1))" },
    "In Progress": { label: "In Progress", color: "hsl(var(--chart-2))" },
    Converted: { label: "Converted", color: "hsl(var(--chart-3))" },
  };

  // Compute chart data based on the number of contacts for each lead status
  const chartData = useMemo(() => {
    if (!leads || leads.length === 0) return []; // Handle empty leads case

    const statusCount = leads.reduce((acc, lead) => {
      const contactCount = lead.contacts.length; // Number of contacts for the lead
      acc[lead.leadStatus] = (acc[lead.leadStatus] || 0) + contactCount;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count], index) => ({
      status,
      count,
      fill: chartConfig[status]?.color || `hsl(var(--chart-${index + 1}))`,
    }));
  }, [leads]);

  // Compute the total number of contacts
  const totalLeads = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  );

  // Render loading state if no leads are present
  if (leads.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Contact Distribution</CardTitle>
        <CardDescription>Distribution by Lead Status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalLeads}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Contacts
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Contact distribution by this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total contacts for the KAM
        </div>
      </CardFooter>
    </Card>
  );
}
