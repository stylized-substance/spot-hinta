import { ResponsiveBar } from "@nivo/bar";
import { BarChartData } from "@/app/types/barChart";

// Reusable bar chart for rendering price data
export default function PriceBarChart({ data }: { data: BarChartData}) {
  return (
    <ResponsiveBar /* or Bar for fixed dimensions */
      data={data}
      indexBy="country"
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 3,
          itemWidth: 100,
          itemHeight: 16,
        },
      ]}
      axisBottom={{ legend: "country (indexBy)", legendOffset: 32 }}
      axisLeft={{ legend: "food", legendOffset: -40 }}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    />
  );
}
