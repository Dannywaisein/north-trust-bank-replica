
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface BarChartProps {
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

export function BarChart({ data }: BarChartProps) {
  // Transform the data format for Recharts
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  // Generate config for Recharts
  const chartConfig = data.datasets.reduce((config, dataset, index) => {
    config[dataset.label] = { 
      label: dataset.label,
      color: Array.isArray(dataset.backgroundColor) 
        ? dataset.backgroundColor[0] 
        : dataset.backgroundColor
    };
    return config;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          {data.datasets.map((dataset, index) => (
            <Bar
              key={index}
              dataKey={dataset.label}
              fill={Array.isArray(dataset.backgroundColor) 
                ? dataset.backgroundColor[index % dataset.backgroundColor.length] 
                : dataset.backgroundColor}
              stroke={Array.isArray(dataset.borderColor) 
                ? dataset.borderColor[index % dataset.borderColor.length] 
                : dataset.borderColor}
              strokeWidth={dataset.borderWidth || 1}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
