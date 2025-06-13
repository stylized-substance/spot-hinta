import clsx from "clsx";

// Generate color codes for prices in tables
export function generatePriceColors(price: number) {
  return clsx(
    price <= 5 && "text-success",
    price > 5 && price <= 10 && "text-warning",
    price > 10 && price <= 20 && "text-error",
    price > 20 && "text-base-content",
  );
}
