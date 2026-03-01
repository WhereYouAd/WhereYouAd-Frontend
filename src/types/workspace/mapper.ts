import type { TWorkspace, TWorkspaceDTO } from "./workspace";

export const toWorkspace = (dto: TWorkspaceDTO): TWorkspace => ({
  id: String(dto.orgId),
  name: dto.name,
  description: dto.description,
  logoUrl: dto.logoUrl,
  myRole: dto.myRole,
});
