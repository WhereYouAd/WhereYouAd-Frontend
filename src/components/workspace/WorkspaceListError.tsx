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
      className="bg-white p-10 text-center border border-gray-100 rounded-component-lg space-y-4"
    >
      <p className="font-body2 text-status-red">{message}</p>
      <Button type="button" variant="primary" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
