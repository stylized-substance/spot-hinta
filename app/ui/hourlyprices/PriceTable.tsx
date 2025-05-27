import { DateTime } from "luxon";
import { PriceDataGroupedByDate } from "@/app/types/priceData";

// Render price table for a single date
export default function PriceTable({
  data,
}: {
  data: PriceDataGroupedByDate;
}) {
  function formatHours(timestamp: DateTime): string {
    const startHour = timestamp.toFormat("HH:00");
    const endHour = timestamp.plus({ hours: 1 }).toFormat("HH:00");
    return `${startHour} - ${endHour}`;
  }

  return (
    <>
      <h1>{data.dateTitle}</h1>
      <table className="table-zebra table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price - c/kWh</th>
          </tr>
        </thead>
        <tbody>
          {data.prices.map((row) => (
            <tr key={row.id}>
              <td>{formatHours(row.timestamp)}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
