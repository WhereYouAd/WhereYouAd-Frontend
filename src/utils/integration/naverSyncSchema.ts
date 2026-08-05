import z from "zod";

const dateFieldSchema = z.string().trim().min(1, "날짜를 선택해 주세요");

export const naverSyncSchema = z
  .object({
    startDate: dateFieldSchema,
    endDate: dateFieldSchema,
  })
  .refine((data) => data.startDate <= data.endDate, {
    path: ["endDate"],
    message: "종료일은 시작일 이전일 수 없습니다",
  });

export type TNaverSyncFormValues = z.infer<typeof naverSyncSchema>;
