"use client"

import { DateTime } from "luxon";

export default function Page() {

  const currentTime = DateTime.now();
  
  console.log(currentTime)
  return (
    <div>{currentTime.toISO()}</div>
  )
  
}