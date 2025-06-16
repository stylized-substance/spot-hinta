"use client";

import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
  // Hide sidebar when clicking a link on mobile
  function handleLinkClick() {
    const sidebarCheckBox = document.getElementById("sidebar");
    if (sidebarCheckBox && sidebarCheckBox instanceof HTMLInputElement) {
      sidebarCheckBox.checked = false;
    }
  }

  return (
    <aside className="bg-base-300 grid min-h-full grid-rows-[auto_1fr] gap-5 overflow-hidden p-4">
      <Link href="/" onClick={handleLinkClick}>
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
      </Link>
      <ul className="ms-2 mt-4 text-lg">
        <li>
          <Link
            href="/chart"
            className="hover:bg-base-300 block p-2"
            onClick={handleLinkClick}
          >
            Chart
          </Link>
        </li>
        <li>
          <Link
            href="/hourlyprices"
            className="hover:bg-base-300 block p-2"
            onClick={handleLinkClick}
          >
            Hourly prices
          </Link>
          <Link
            href="/weeklyprices"
            className="hover:bg-base-300 block p-2"
            onClick={handleLinkClick}
          >
            Weekly prices
          </Link>
          <Link
            href="/yearlyprices"
            className="hover:bg-base-300 block p-2"
            onClick={handleLinkClick}
          >
            Yearly prices
          </Link>
        </li>
      </ul>
    </aside>
  );
}
