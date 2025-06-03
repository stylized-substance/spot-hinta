import { DateTime } from "luxon";
import { PriceDataGroupedByDate } from "@/app/types/priceData";
import clsx from "clsx";

// Render price table for a single date
export default function PriceTable({ data }: { data: PriceDataGroupedByDate }) {
  // Create DateTime object from current time in Finland. Used for highlighting current hour in table
  const currentTimeInFinland: DateTime = DateTime.now().setZone("Europe/Helsinki");

  function formatHours(timestamp: DateTime): string {
    const startHour = timestamp.toFormat("HH:00");
    const endHour = timestamp.plus({ hours: 1 }).toFormat("HH:00");
    return `${startHour} - ${endHour}`;
  }

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
                <td>{formatHours(row.timestamp)}</td>
                <td
                  className={clsx(
                    Number(row.price) < 0.1 && "text-success",
                    Number(row.price) > 0.1 &&
                      Number(row.price) < 0.2 &&
                      "text-warning",
                    Number(row.price) > 0.2 && "text-error",
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
