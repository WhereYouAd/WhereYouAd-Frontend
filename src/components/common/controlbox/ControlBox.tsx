import type { HTMLAttributes, ReactNode } from "react";
import type React from "react";
import { twMerge } from "tailwind-merge";

import Button from "../button/Button";

interface IControlBoxProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  buttonSize?: React.ComponentProps<typeof Button>["size"];
  buttonClassName?: string;
  buttonSlot?: ReactNode;
  leadingSlot?: ReactNode;
  contentClassName?: string;
}

export default function ControlBox({
  title,
  description,
  buttonText,
  onButtonClick,
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
  buttonVariant = "primary",
  buttonSize = "small",
  buttonClassName,
  buttonSlot,
  leadingSlot,
  contentClassName,
  ...rest
}: IControlBoxProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between min-w-180 px-7 py-6 border-[0.5px]  rounded-component-lg",
        "border-chart-3 bg-chart-3/7",
        containerClassName,
        className,
      )}
      {...rest}
    >
      <div
        className={twMerge(
          "flex items-center gap-4 sm:gap-8",
          contentClassName,
        )}
      >
        {leadingSlot ? <div className="shrink-0">{leadingSlot}</div> : null}
        <div className="flex flex-col gap-2">
          <h3 className={twMerge("font-heading3 text-chart-3", titleClassName)}>
            {title}
          </h3>
          <p
            className={twMerge(
              "font-body2 text-text-sub whitespace-pre-line leading-relaxed",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {buttonSlot ?? (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={onButtonClick}
          className={twMerge(
            "shrink-0 !h-button-big px-8 !rounded-component-md",
            buttonClassName,
          )}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
