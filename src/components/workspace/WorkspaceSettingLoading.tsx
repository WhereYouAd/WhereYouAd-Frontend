function WorkspaceSettingSkeleton() {
  return (
    <>
      <li>
        <div>aa</div>
      </li>
    </>
  );
}

export default function WorkspaceSettingLoading() {
  return (
    <ul
      role="status"
      aria-label="워크스페이스 관리 불러오는 중"
      className="space-y-5"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <WorkspaceSettingSkeleton key={i} />
      ))}
    </ul>
  );
}
