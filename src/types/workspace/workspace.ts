export type TWorkSpaceId = string;
export type TWorkspace = {
  id: TWorkSpaceId;
  name: string;
  description: string;
  url?: string | null;
  logoUrl?: string | null;
  myRole: string;
};
