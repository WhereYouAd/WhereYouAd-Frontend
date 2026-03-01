export type TWorkSpaceId = string;
export type TWorkspace = {
  id: TWorkSpaceId;
  name: string;
  description: string;
  url?: string | null;
  logoUrl?: string | null;
  myRole: string;
};

// UI구현할때, id로 해놓았는데, DTO코드작성하지 말고, swagger에 맞게 코드 작성해볼까?
export type TWorkspaceDTO = {
  orgId: number;
  name: string;
  description: string;
  logoUrl: string | null;
  myRole: string;
};
export type TApiResult<T> = {
  status: string;
  data: T;
};

export type TMyOrgsData = {
  organizations: TWorkspaceDTO[];
};

export type TCreateOrgRequest = {
  name: string;
  description: string;
  logoUrl?: string | null;
};

export type TCreateOrgResponse = {
  name: string;
  description: string;
  logoUrl: string | null;
};

export type TGetOrgResponse = {
  orgId: number;
  name: string;
  description: string;
  logoUrl: string | null;
  createdAt: string;
};

export type TWorkspaceDetail = {
  id: TWorkSpaceId;
  name: string;
  description: string;
  logoUrl: string | null;
  createdAt: string;
};

export type TUpdateWorkspaceRequest = {
  name: string;
  description: string;
  logoUrl: string | null;
};
