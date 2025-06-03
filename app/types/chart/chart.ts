// Type for data input into nivo line chart
export type ChartData = {
  id: string | number;
  data: {
    x: number | string | Date;
    y: number | string | Date;
  }[];
}[];