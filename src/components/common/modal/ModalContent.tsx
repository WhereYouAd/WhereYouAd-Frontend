import type { ReactNode } from "react";

import Button from "@/components/common/button/Button";

interface IModalContentProps {
  icon?: ReactNode;
  title: string;
  description: string | ReactNode;
  buttonText: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "danger" | "primary";
}

export default function ModalContent({
  icon,
  title,
  description,
  buttonText,
  onConfirm,
  isLoading,
  variant = "danger",
}: IModalContentProps) {
  return (
    <div className="text-center px-2 pt-10 pb-6">
      <div className="flex justify-center items-center gap-2 mb-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <h3 className="font-heading2 text-text-main leading-none">{title}</h3>
      </div>
      <div className="font-body1 text-text-auth-sub mb-7 leading-relaxed">
        {description}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant={variant}
          size="big"
          onClick={onConfirm}
          className="w-auto px-12 tablet:w-full"
          disabled={isLoading}
        >
          {isLoading ? "처리 중.." : buttonText}
        </Button>
      </div>
    </div>
  );
}
