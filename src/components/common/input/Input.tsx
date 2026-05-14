import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { twMerge } from "tailwind-merge";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  rightElement?: ReactNode;
  wrapperClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      rightElement,
      wrapperClassName,
      containerClassName,
      inputClassName,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperTextId = helperText ? `${inputId}-helper-text` : undefined;

    return (
      <div
        className={twMerge("flex flex-col w-full relative", wrapperClassName)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-text-title select-none ml-1 mb-2"
          >
            {label}
          </label>
        )}
        <div
          className={twMerge(
            "flex items-center w-full h-14 bg-surface-100 ring-1 ring-surface-400 rounded-2xl transition-colors duration-200 ease-out overflow-hidden",
            disabled
              ? "bg-surface-200 cursor-not-allowed"
              : error
                ? "ring-2 ring-info-red bg-info-red/5"
                : success
                  ? "ring-2 ring-primary-400 bg-primary-100"
                  : "hover:bg-surface-200 hover:ring-surface-400 focus-within:bg-surface-100 focus-within:ring-2 focus-within:ring-surface-400",
            containerClassName,
          )}
        >
          <input
            ref={ref}
            className={twMerge(
              "flex-1 h-full w-full bg-transparent border-none outline-none font-body1 text-text-title placeholder:text-text-placeholder px-5",
              "disabled:cursor-not-allowed disabled:text-text-muted",
              rightElement ? "pr-2" : "",
              inputClassName,
            )}
            id={inputId}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={helperTextId}
            disabled={disabled}
            {...props}
          />
          {rightElement && (
            <div className="flex items-center pr-4 shrink-0">
              {rightElement}
            </div>
          )}
        </div>
        {helperText && (
          <div
            id={helperTextId}
            aria-live="polite"
            className={twMerge(
              "font-caption pl-1 mt-1.5",
              error ? "text-info-red" : "text-text-body",
            )}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
