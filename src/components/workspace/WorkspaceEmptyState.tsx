interface IWorkspaceEmptyStateProps {
  message: string;
}

export default function WorkspaceEmptyState({
  message,
}: IWorkspaceEmptyStateProps) {
  return (
    <div className="rounded-component-lg bg-white p-10 text-center border border-gray-100">
      <p className="font-body2 text-text-sub">{message}</p>
    </div>
  );
}
