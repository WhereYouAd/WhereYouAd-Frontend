interface IWorkspaceEmptyStateProps {
  message: string;
}

export default function WorkspaceEmptyState({
  message,
}: IWorkspaceEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-surface-400 bg-surface-100 p-10 text-center">
      <p className="font-body2 text-text-muted">{message}</p>
    </div>
  );
}
