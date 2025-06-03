"use client";

import { Line, ResponsiveLine } from "@nivo/line";

type ChartData = {
  id: string | number;
  data: {
    x: number | string | Date;
    y: number | string | Date;
  }[];
}[];

// TODO: inherit background color from daisyui theme
const chartTheme = {
  background: "#241f31",
  text: {
    fontSize: 12,
    fill: "#ffffff",
    outlineWidth: 0,
    outlineColor: "#000000",
  },
  axis: {
    domain: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "#ffffff",
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {
        fontSize: 12,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "#ffffff",
      },
    },
  },
  grid: {
    line: {
      stroke: "#3d3846",
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 12,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "#ffffff",
      },
    },
    text: {
      fontSize: 12,
      fill: "#ffffff",
      outlineWidth: 0,
      outlineColor: "#ffffff",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "#333333",
        outlineWidth: 0,
        outlineColor: "#ffffff",
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: "#333333",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: "#ffffff",
      color: "#333333",
      fontSize: 12,
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
};

export default function LineChart({
  data,
  /* see data tab */
}: {
  data: ChartData;
}) {
  console.log(data);

  return (
    <>
      <Line
        data={data}
        height={800}
        width={1600}
        theme={chartTheme}
        // defaultHeight={400}
        // defaultWidth={800}
        margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
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
          tickValues: "every 15 minutes",
        }}
        axisLeft={{ legend: "Price - c/kWh", legendOffset: -45 }}
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
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
