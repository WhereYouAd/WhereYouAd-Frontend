export type TWorkspace = {
  orgId: number;
  name: string;
  description: string;
  url?: string | null;
  logoUrl?: string | null;
  myRole: string;
};

export type TMyOrgsData = {
  organizations: TWorkspace[];
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

export type TWorkspaceDetail = TGetOrgResponse;

export type TUpdateWorkspaceRequest = {
  name: string;
  description: string;
  logoUrl: string | null;
};
export type TApiResult<T> = {
  status: string;
  data: T;
};
