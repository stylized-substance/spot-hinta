"use client";

import { Line, ResponsiveLine } from "@nivo/line";
import { chartTheme } from "@/app/ui/chart/config";
import { ChartData } from "@/app/types/chart/chart";

export default function LineChart({
  data,
  type,
}: {
  data: ChartData;
  type: "price" | "powerForecast";
}) {
  // Render dummy values in chart if input data is not defined
  if (!data) {
    data = [
      {
        id: 0,
        data: [
          {
            x: 0,
            y: 0,
          },
        ],
      },
    ];
  }

  // Set chart left axis legend based on data type being rendered
  const axisLeft = type === "price" ? "Price - c/kWh" : "Production - kWh";

  return (
    <>
      <h1 className="text-center mt-4 mb-4 text-2xl">{data[0].id}</h1>
      <Line
        data={data}
        height={800}
        width={1600}
        theme={chartTheme}
        // defaultHeight={400}
        // defaultWidth={800}
        margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
        xScale={{
          format: "%m-%d-%h-%m",
          type: "time",
          precision: "hour",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisRight={{ legend: "Production - kWh", legendOffset: 45 }}
        axisBottom={{
          legend: "Time",
          legendOffset: 35,
          format: "%H:%M",
          tickValues: "every hour",
        }}
        axisLeft={{ legend: axisLeft, legendOffset: -45 }}
        enablePoints={true}
        enablePointLabel
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        crosshairType={"cross"}
        useMesh={true}
        legends={[
          {
            justify: false,
            anchor: "bottom",
            direction: "row",
            translateY: 65,
            itemWidth: 100,
            itemHeight: 22,
            symbolSize: 20,
            symbolShape: "circle",
          },
        ]}
      />
    </>
  );
}
