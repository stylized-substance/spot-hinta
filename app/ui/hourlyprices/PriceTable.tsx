import { DateTime } from "luxon";
import { PriceDataGroupedByDate } from "@/app/types/priceData";
import { formatHours } from "@/app/lib/formatHours";
import clsx from "clsx";

// Render price table for a single date
export default function PriceTable({ data }: { data: PriceDataGroupedByDate }) {
  // Create DateTime object from current time in Finland. Used for highlighting current hour in table
  const currentTimeInFinland: DateTime =
    DateTime.now().setZone("Europe/Helsinki");

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">{data.dateTitle}</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price - c/kWh</th>
          </tr>
        </thead>
        <tbody>
          {data.prices.map((row) => {
            const isCurrentHour =
              row.timestamp.hasSame(currentTimeInFinland, "day") &&
              row.timestamp.hour === currentTimeInFinland.hour;
            return (
              <tr
                className={clsx(
                  isCurrentHour && "border-info border-2 border-dotted",
                )}
                key={row.id}
              >
                {/* Format hours to format eg. 10:00 - 20:00 */}
                <td>{formatHours(row.timestamp)}</td>
                <td
                  className={clsx(
                    Number(row.price) <= 5 && "text-success",
                    Number(row.price) > 5 &&
                      Number(row.price) <= 10 &&
                      "text-warning",
                    Number(row.price) > 10 &&
                      Number(row.price) <= 20 &&
                      "text-error",
                    Number(row.price) > 20 && "text-base-content",
                  )}
                >
                  {row.price}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
