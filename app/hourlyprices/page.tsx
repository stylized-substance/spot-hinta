import { fetchPrices } from "@/app/lib/fetchPrices";
import { PriceData } from "@/app/lib/types";

export default async function PriceTable() {
  const priceData: PriceData = await fetchPrices();

  return (
    <div>
      <h1>Price table</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {priceData.map((row) => (
            <tr key={row.id}>
              <td>{`${String(row.timestamp.getUTCHours()).padStart(2, "0")}:00`}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
