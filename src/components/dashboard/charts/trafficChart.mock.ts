export interface ITrafficChartData {
  labels: string[]; // x축 시간 레이블
  clicks: number[]; // 시간별 클릭수
}

// 목업 데이터
export const trafficChartMock: ITrafficChartData = {
  labels: Array.from(
    { length: 25 },
    (_, i) => `${String(i).padStart(2, "0")}:00`,
  ),
  clicks: [
    32000, 33500, 34000, 35500, 36000, 37500, 45000, 46500, 47000, 46000, 50000,
    53000, 54000, 52000, 48000, 46000, 44000, 43000, 45500, 41000, 38000, 36000,
    42000, 48000, 51000,
  ],
};
