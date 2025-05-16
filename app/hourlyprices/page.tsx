import { fetchPrices } from "@/app/lib/fetchPrices";
import { PriceData } from "@/app/lib/types";

export default async function PriceTable() {
  const priceData: PriceData = await fetchPrices();
  
  function formatTitle() {
    const { timestamp }: { timestamp: Date} = priceData[0]
    return timestamp.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  function formatHours(timestamp: Date): string {
    const startHour = `${timestamp.getUTCHours().toString().padStart(2, "0")}:00`
    const endHour = `${(timestamp.getUTCHours() + 1).toString().padStart(2, "0")}:00`
    return (`${startHour} - ${endHour}`)
  }

  return (
    <div>
      <h1>{formatTitle()}</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price with VAT - c/kWh</th>
          </tr>
        </thead>
        <tbody>
          {priceData.map((row) => (
            <tr key={row.id}>
              <td>{formatHours(row.timestamp)}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
