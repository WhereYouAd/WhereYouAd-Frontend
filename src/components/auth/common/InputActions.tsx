import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";

interface IInputActionsProps {
  button?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  validationState?: string;
  timer?: string;
  validation?: boolean;
  error?: boolean;
  type?: string;
}

export default function InputActions({
  button,
  buttonText,
  onButtonClick,
  validationState,
  timer,
  validation = false,
  error = false,
  type,
}: IInputActionsProps) {
  if (!button && !validationState && !timer) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {timer && (
        <span className="text-status-red font-body2 mr-3">{timer}</span>
      )}
      {button && (
        <Button
          size="small"
          disabled={type === "code" ? false : error || !validation}
          variant={validation ? "primary" : "custom"}
          className="py-1 px-3 h-full"
          onClick={onButtonClick}
          type="button"
        >
          {buttonText}
        </Button>
      )}
      {validationState && (
        <span
          className={twMerge(
            "flex items-center justify-center rounded-2xl font-body1 whitespace-nowrap py-1 px-3 h-full cursor-default",
            validation ? "bg-brand-800 text-white" : "opacity-50",
          )}
        >
          {validationState}
        </span>
      )}
    </div>
  );
}
