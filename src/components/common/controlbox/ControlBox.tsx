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
  buttonDisabled?: boolean;
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
  buttonDisabled,
  buttonSlot,
  leadingSlot,
  contentClassName,
  ...rest
}: IControlBoxProps) {
  return (
    <div
      className={twMerge(
        "flex w-full min-w-0 items-center justify-between gap-6 px-7 py-6  border-[0.5px] border-chart-3/7 rounded-component-lg",
        "tablet:flex-col tablet:items-start tablet:px-5 tablet:py-5",
        containerClassName,
        className,
      )}
      {...rest}
    >
      <div
        className={twMerge(
          "flex min-w-0 items-center gap-8 tablet:gap-4",
          contentClassName,
        )}
      >
        {leadingSlot ? <div className="shrink-0">{leadingSlot}</div> : null}
        <div className="flex min-w-0 flex-col gap-2">
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
          disabled={buttonDisabled}
          className={twMerge(
            "shrink-0 px-8 rounded-component-md! tablet:w-full tablet:justify-center",
            buttonClassName,
          )}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
