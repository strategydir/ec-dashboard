"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  TooltipItem,
} from "chart.js";
import { useEffect, useState } from "react";
import { Empty } from "antd";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export interface IPieChart {
  data: number[];
  colors?: string[];
  labels: string[];
}

interface IProps {
  chartProp?: IPieChart;
}

const PieChart = ({ chartProp }: IProps) => {
  const [chart, setChart] = useState<ChartData<"pie", number[], unknown>>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!chartProp) return;
    const {
      data,
      labels,
      colors = ["#FF6384", "#36A2EB", "#FFCE56"],
    } = chartProp;
    setChart({
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    });
  }, [chartProp]);

  return chartProp && chartProp.data.length ? (
    <Pie
      data={chart}
      options={{
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              // font: {
              //   family: "Athiti",
              //   size: 16,
              // },
              font: (context) => {
                // Dynamically calculate font size based on chart width
                const width = context.chart.width;
                const size = Math.round(width / 25); // Adjust divisor for desired scaling
                return {
                  family: "Athiti",
                  size: size > 16 ? 16 : 12, // Minimum font size
                };
              },
            },
          },
          tooltip: {
            // bodyFont: {
            //   family: "Athiti",
            //   size: 16,
            // },
            // titleFont: {
            //   family: "Athiti",
            //   size: 16,
            //   weight: 600,
            // },
            bodyFont: (context) => {
              const width = context.chart.width;
              const size = Math.round(width / 30);
              return {
                family: "Athiti",
                size: size > 16 ? 16 : 12,
              };
            },
            titleFont: (context) => {
              const width = context.chart.width;
              const size = Math.round(width / 28);
              return {
                family: "Athiti",
                size: size > 16 ? 16 : 12,
                weight: 600,
              };
            },
            callbacks: {
              label: (tooltipItem: TooltipItem<"pie">) => {
                const value = tooltipItem.raw || 0;
                return `จำนวน: ${value} โครงการ`;
              },
            },
          },
          datalabels: {
            color: "#fff", // Text color
            anchor: "center", // Position inside the slice
            align: "center",
            clip: true,
            // font: {
            //   family: "Athiti",
            //   size: 14,
            // },
            font: (context) => {
              const width = context.chart.width;
              const size = Math.round(width / 30);
              return {
                family: "Athiti",
                size: size > 12 ? 14 : 12,
              };
            },
            formatter: (value, context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              const label = context.chart.data.labels[context.dataIndex];
              return `${label}\n ${value} โครงการ\n   (${percentage} %)`;
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      }}
    />
  ) : (
    <Empty
      styles={{ image: { width: "100%", height: "auto" } }}
      description={
        <p style={{ fontFamily: "Athiti" }}>{"ยังไม่เปิดรับพิจารณา"}</p>
      }
    />
  );
};

export default PieChart;
