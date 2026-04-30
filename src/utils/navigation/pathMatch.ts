export const normalizePathname = (pathname: string) =>
  pathname.replace(/\/+$/, "") || "/";

export const isPathMatch = (currentPath: string, targetPath: string) =>
  currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
