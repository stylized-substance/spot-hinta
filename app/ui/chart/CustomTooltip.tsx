import { DataPoint } from "@/app/types/chart/chart";
import { DateTime } from "luxon";

// Custom nivo chart tooltip box
export default function CustomTooltip({
  point,
  type,
}: {
  point: DataPoint;
  type: "price" | "powerForecast";
}) {
  // Change date format in tooltip
  const formattedDate = point.data.x ? DateTime.fromJSDate(
    new Date(point.data.x),
  ).toLocaleString(DateTime.DATE_FULL) : "";

  return (
    <div className="bg-base-content/70 text-neutral border p-2 text-center">
      <strong>{point.seriesId}</strong>
      <div>{formattedDate}</div>
      <div>
        {point.data.yFormatted} {type === "price" ? "c/kWh" : "kWh"}
      </div>
    </div>
  );
}
