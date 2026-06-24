export interface ITimeSeriesData {
  minute: string; // YYYYMMDDHHmm
  count: number;
}

export interface IClickStreamResponse {
  timeSeriesData: ITimeSeriesData[];
  mode: "real" | "dummy";
  hasSuspect: boolean;
  suspectDetail: {
    provider: string;
    campaignName: string;
    adName: string;
    message: string;
    timestamp: string;
  } | null;
}

/** 실시간 트래픽 데이터 생성 (최근 60분) */
const generateRealTimeTraffic = (
  _platform: string,
  baseCount: number,
): IClickStreamResponse => {
  const timeSeriesData: ITimeSeriesData[] = [];
  const now = new Date();

  for (let i = 59; i >= 0; i--) {
    const targetDate = new Date(now.getTime() - i * 60 * 1000);
    const minuteStr =
      targetDate.getFullYear().toString() +
      (targetDate.getMonth() + 1).toString().padStart(2, "0") +
      targetDate.getDate().toString().padStart(2, "0") +
      targetDate.getHours().toString().padStart(2, "0") +
      targetDate.getMinutes().toString().padStart(2, "0");

    const wave = Math.sin(targetDate.getTime() / (1000 * 60 * 12)) * 0.4;
    const random = (Math.random() - 0.5) * 0.3;
    const count = Math.max(10, Math.floor(baseCount * (1 + wave + random)));

    timeSeriesData.push({
      minute: minuteStr,
      count,
    });
  }

  return {
    timeSeriesData,
    mode: "dummy",
    hasSuspect: false,
    suspectDetail: null,
  };
};

export const platformTrafficMock: Record<string, IClickStreamResponse> = {
  GOOGLE: generateRealTimeTraffic("GOOGLE", 450),
  NAVER: generateRealTimeTraffic("NAVER", 280),
  META: generateRealTimeTraffic("META", 620),
};
