import z from "zod";

import {
  TIMELINE_COMPARISON_PERIOD_VALUES,
  TIMELINE_METRIC_VALUES,
} from "@/constants/timeline/formOptions";

const dataFieldSchema = z.string().trim().min(1, "날짜를 선택해 주세요");

export const timelineCreateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "타임라인 이름을 입력해주세요")
      .max(50, "이름은 50자 이내로 입력해주세요"),
    startDate: dataFieldSchema,
    endDate: dataFieldSchema,
    metrics: z
      .array(z.enum(TIMELINE_METRIC_VALUES))
      .min(1, "성과 지표를 1개 이상 선택해주세요"),
    comparisonPeriodType: z.enum(TIMELINE_COMPARISON_PERIOD_VALUES),
  })
  .refine((data) => data.startDate <= data.endDate, {
    path: ["endDate"],
    message: "종료일은 시작일 이전이 불가합니다",
  });

export type TTimelineCreateFormValues = z.infer<typeof timelineCreateSchema>;
