export type TWorkSpaceId = string;
export type TWorkspace = {
  id: TWorkSpaceId;
  name: string;
  description: string;
  url?: string | null;
  logoUrl?: string | null;
  myRole: string;
  representativeName?: string; //figma에서는 대표명. erd에서는 없어서 일단 보류. 빼도될듯
};
