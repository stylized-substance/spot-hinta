// Type for data input into nivo line chart
export type LineChartData = {
  id: string | number;
  data: {
    x: number | string | Date;
    y: number | string | Date;
  }[];
}[];

// Type for data points sent into custom tooltip component
 export type DataPoint = {
    absIndex: number;
    borderColor: string;
    color: string;
    data: {
      x: string | number | Date | null;
      y: string | number | Date | null;
      xFormatted: string;
      yFormatted: string;
    };
    id: string;
    indexInSeries: number;
    seriesColor: string;
    seriesId: string | number;
    seriesIndex: number;
    x: number;
    y: number;
  }