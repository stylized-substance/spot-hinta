import LineChart from "@/app/ui/chart/LineChart";

export default async function Page() {
  // Fetch prices for the last week
  // const priceData: PriceDataArray | [] = await fetchPrices(7);

  // const data = [
  //   {
  //     id: 1,
  //     data: [
  //       {
  //         x: 0,
  //         y: 0,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     data: [
  //       {
  //         x: 15,
  //         y: 30,
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     data: [
  //       {
  //         x: 30,
  //         y: 60,
  //       },
  //     ],
  //   },
  // ];

  const data = [
    {
      id: 1,
      data: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 15,
          y: 60,
        },
        {
          x: 30,
          y: 40,
        },
      ],
    },
  ];

  return (
    <>
      <LineChart data={data} />
    </>
  );
}
