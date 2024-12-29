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

export function LeadPie({ leads = [] }) {
  
    const chartConfig = {
      New: { label: "New", color: "hsl(var(--chart-1))" },
      "In Progress": { label: "In Progress", color: "hsl(var(--chart-2))" },
      Converted: { label: "Converted", color: "hsl(var(--chart-3))" },
    };
  
    const chartData = useMemo(() => {
      if (!leads || leads.length === 0) return []; // Handle case when leads are not available
      const statusCount = leads.reduce((acc, lead) => {
        acc[lead.leadStatus] = (acc[lead.leadStatus] || 0) + 1;
        return acc;
      }, {});
  
      return Object.entries(statusCount).map(([status, count], index) => ({
        status,
        count,
        fill: chartConfig[status]?.color || `hsl(var(--chart-${index + 1}))`,
      }));
    }, [leads]);
  
    const totalLeads = useMemo(
      () => chartData.reduce((acc, curr) => acc + curr.count, 0),
      [chartData]
    );
  
    if (leads.length === 0) {
      // Render a loading indicator or placeholder
      return <div>Loading chart...</div>;
    }
  
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Lead Status</CardTitle>
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
                            Leads
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Lead status by this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total leads for the KAM
          </div>
        </CardFooter>
      </Card>
    );
  }
  