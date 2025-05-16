import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const quicksand = Quicksand({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spot-hinta",
  description: "Finnish electricity price tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} antialiased`}>
        <div className="drawer xl:drawer-open">
          <input id="sidebar" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="sidebar"
              className="btn btn-soft btn-square drawer-button xl:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </label>
            {/* Main content*/}
            <main className="overflow-y-auto">{children}</main>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="sidebar"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            {/* Sidebar*/}
            <aside className="bg-base-300 grid min-h-full grid-rows-[auto_1fr] gap-5 overflow-hidden p-4">
              <div className="grid justify-items-center">
                <Image
                  src="/images/lightning-charge-fill-600x600.png"
                  alt="Lightning logo"
                  className="h-16 w-16"
                  height={600}
                  width={600}
                ></Image>
                <h1 className="mt-2 text-2xl font-bold">Spot-hinta</h1>
              </div>
              <ul className="ms-2 mt-4 text-lg">
                <li>
                  <Link href="/chart" className="hover:bg-base-300 block p-2">
                    Chart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hourlyprices"
                    className="hover:bg-base-300 block p-2"
                  >
                    Hourly prices
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
          {/* </div> */}
        </div>
      </body>
    </html>
  );
}
