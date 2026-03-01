import type {
  TGetOrgResponse,
  TWorkspace,
  TWorkspaceDetail,
  TWorkspaceDTO,
} from "./workspace";

export const toWorkspace = (dto: TWorkspaceDTO): TWorkspace => ({
  id: String(dto.orgId),
  name: dto.name,
  description: dto.description,
  logoUrl: dto.logoUrl,
  myRole: dto.myRole,
});

export const toWorkspaceDetail = (dto: TGetOrgResponse): TWorkspaceDetail => ({
  id: String(dto.orgId),
  name: dto.name,
  description: dto.description,
  logoUrl: dto.logoUrl,
  createdAt: dto.createdAt,
});
