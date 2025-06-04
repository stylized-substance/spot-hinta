import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import SideBar from "@/app/ui/sidebar"
import Header from "@/app/ui/header"


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
            <Header />
            {/* Main content*/}
            <main className="overflow-y-auto">{children}</main>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="sidebar"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <SideBar />
          </div>
        </div>
      </body>
    </html>
  );
}
