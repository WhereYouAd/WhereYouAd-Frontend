interface ITrend {
  direction: "up" | "down";
  value: string;
}

export interface IKpiMetric {
  title: string;
  value: string | number;
  trend?: ITrend;
}

export interface IOverviewData {
  kpis: IKpiMetric[];
}
