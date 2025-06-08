"use client";

import { ResponsiveLine } from "@nivo/line";
import CustomTooltip from "@/app/ui/chart/CustomTooltip";
import { chartTheme } from "@/app/ui/chart/config";
import { ChartData } from "@/app/types/chart/chart";
import { DateTime } from "luxon";

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

  // Set chart y-axis legend based on data type being rendered
  const yAxisLegend = type === "price" ? "Price - c/kWh" : "Production - kWh";

  // Get current time in Finland
  const currentTimeInFinland = DateTime.utc()
    .setZone("Europe/Helsinki")
    .toJSDate();

  return (
    <div className="mt-8 mb-16 h-[60vh] max-h-[500px] min-h-[200px] w-full">
      <h1 className="mt-4 mb-4 text-center text-2xl">
        {type === "price" ? "Electricity prices" : "Power statistics"}
      </h1>
      <ResponsiveLine
        data={data}
        theme={chartTheme}
        margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
        xScale={{
          type: "time",
          precision: "hour",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisBottom={{
          legend: "Time",
          legendOffset: 35,
          format: "%H:%M",
          tickValues: "every hour",
        }}
        axisLeft={{ legend: yAxisLegend, legendOffset: -45 }}
        axisRight={{ legend: yAxisLegend, legendOffset: -45 }}
        enablePoints={false}
        enablePointLabel
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        crosshairType={"cross"}
        useMesh={true}
        /*Tooltip is wrapped in an inline function to facilitate passing custom "type" prop */
        tooltip={(pointProps) => <CustomTooltip {...pointProps} type={type} />}
        legends={[
          {
            justify: false,
            anchor: "bottom",
            direction: "row",
            translateY: 65,
            itemWidth: 100,
            itemHeight: 22,
            symbolSize: 20,
            itemsSpacing: 120,
            symbolShape: "circle",
          },
        ]}
        markers={[
          {
            axis: "x",
            value: currentTimeInFinland,
            lineStyle: { stroke: "red", strokeWidth: 2 },
            legend: "Now",
            legendPosition: "top-right",
            textStyle: { fill: "red", fontWeight: "bold" },
          },
        ]}
      />
    </div>
  );
}
