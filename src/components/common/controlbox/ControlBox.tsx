import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import Button from "../button/Button";

interface IControlBoxProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function ControlBox({
  title,
  description,
  buttonText,
  onButtonClick,
  className,
  ...rest
}: IControlBoxProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between min-w-180 px-7 py-6 bg-chart-3/7 border-[0.5px] border-chart-3 rounded-component-lg",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-heading3 text-chart-3">{title}</h3>
        <p className="font-body2 text-text-sub whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>
      <Button
        variant="primary"
        size="small"
        onClick={onButtonClick}
        className="shrink-0 !h-button-big px-8 !rounded-component-md"
      >
        {buttonText}
      </Button>
    </div>
  );
}
