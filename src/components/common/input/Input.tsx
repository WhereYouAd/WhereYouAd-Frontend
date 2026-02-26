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
            className="text-text-main select-none ml-1 mb-1"
          >
            {label}
          </label>
        )}
        <div
          className={twMerge(
            "flex items-center w-full h-input bg-white ring-1 ring-logo-1/30 rounded-component-md transition-colors duration-200 ease-out overflow-hidden",
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : error
                ? "ring-2 ring-status-red bg-status-red/5"
                : success
                  ? "ring-2 ring-status-green bg-status-green/5"
                  : "hover:bg-gray-100 hover:ring-logo-1/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-logo-1/50",
            containerClassName,
          )}
        >
          <input
            ref={ref}
            className={twMerge(
              "flex-1 h-full w-full bg-transparent border-none outline-none text-body1 text-text-main placeholder:text-text-placeholder px-5",
              "disabled:cursor-not-allowed disabled:text-text-disabled",
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
              error ? "text-status-red" : "text-text-sub",
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
