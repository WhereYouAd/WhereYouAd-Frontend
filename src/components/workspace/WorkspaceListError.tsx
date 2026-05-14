import Button from "../common/button/Button";

interface IWorkspaceListErrorProps {
  message: string;
  onRetry: () => void;
}

export default function WorkspaceListError({
  message,
  onRetry,
}: IWorkspaceListErrorProps) {
  return (
    <div
      role="alert"
      className="space-y-4 rounded-3xl border border-surface-400 bg-surface-100 p-10 text-center"
    >
      <p className="font-body2 text-info-red">{message}</p>
      <Button type="button" variant="primary" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
