import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Image from "next/image";

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
        <div className="grid h-screen grid-cols-[0.08fr_minmax(0,1fr)] grid-rows-1">
          <aside className="mt-4 grid grid-rows-[auto_1fr] gap-5">
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
                <a href="#" className="hover:bg-base-300 block p-2">
                  Chart
                </a>
              </li>
              <li>
                <a href="#" className="hover:bg-base-300 block p-2">
                  Hourly prices
                </a>
              </li>
            </ul>
          </aside>
          {children}
        </div>
      </body>
    </html>
  );
}
