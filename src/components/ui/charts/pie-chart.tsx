
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor: string | string[];
      borderWidth?: number;
    }[];
  };
}

export function PieChart({ data }: PieChartProps) {
  // Transform the data format for Recharts
  const transformedData = data.labels.map((label, index) => {
    return {
      name: label,
      value: data.datasets[0].data[index],
    };
  });

  // Generate config for Recharts
  const chartConfig = data.labels.reduce((config, label, index) => {
    const bgColors = data.datasets[0].backgroundColor;
    config[label] = { 
      label,
      color: Array.isArray(bgColors) ? bgColors[index % bgColors.length] : bgColors
    };
    return config;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {transformedData.map((entry, index) => {
              const backgroundColor = data.datasets[0].backgroundColor;
              const color = Array.isArray(backgroundColor) 
                ? backgroundColor[index % backgroundColor.length] 
                : backgroundColor;
              
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
