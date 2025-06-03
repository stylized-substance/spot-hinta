"use client";

import { Line } from "@nivo/line";

type ChartData = {
  id: string | number;
  data: {
    x: number | string | Date;
    y: number | string | Date;
  }[];
}[];

export default function LineChart({
  data,
  /* see data tab */
}: {
  data: ChartData;
}) {
  console.log(data);
  return (
    <>
      <h1>Chart</h1>
      <Line /* or Line for fixed dimensions */
        animate
        curve="monotoneX"
        data={data}
        enableSlices="x"
        enableTouchCrosshair
        height={400}
        initialHiddenIds={["cognac"]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            itemHeight: 20,
            itemWidth: 80,
            toggleSerie: true,
            translateY: 50,
          },
        ]}
        margin={{
          bottom: 60,
          left: 80,
          right: 20,
          top: 20,
        }}
        width={900}
        yScale={{
          stacked: true,
          type: "linear",
        }}
      />
    </>
  );
}
