function MemberManagementSkeleton() {
  return (
    <>
      <li>
        <div>aa</div>
      </li>
    </>
  );
}

export default function MemberManagementLoading() {
  return (
    <ul role="status" aria-label="멤버관리 불러오는 중" className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <MemberManagementSkeleton key={i} />
      ))}
    </ul>
  );
}
