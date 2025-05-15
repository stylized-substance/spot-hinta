import sql from "@/app/lib/db";
import { HourPrice } from "@/app/lib/types";

export default async function PriceTable() {
  const priceData = await sql<
    HourPrice[]
  >`SELECT timestamp, price FROM price_data`;
  console.log(priceData);

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
            <>
              <tr>
                <td>{`${String(row.timestamp.getUTCHours()).padStart(2, "0")}:00`}</td>
                <td>{row.price}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
