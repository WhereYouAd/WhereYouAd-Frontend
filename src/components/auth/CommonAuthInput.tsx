import type { InputHTMLAttributes } from "react";
import React, { useState } from "react";

import formatInputNumber from "@/utils/formatPhoneNumber";

import Button from "@/components/common/Button";

import EyeIcon from "@/assets/auth/password/eye.svg?react";
import EyeOffIcon from "@/assets/auth/password/eye-off.svg?react";

type TCommonAuthInputProps = {
  type?: string;
  placeholder?: string;
  title?: string;
  validation?: boolean;
  validationState?: string;
  error?: boolean;
  value?: string;
  errorMessage?: string;
  button?: boolean;
  buttonText?: string;
  buttonOnclick?: () => void;
  short?: boolean;
  timer?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const CommonAuthInput = React.forwardRef<
  HTMLInputElement,
  TCommonAuthInputProps
>(
  (
    {
      type,
      placeholder,
      title,
      validation = false,
      value,
      errorMessage,
      error,
      button,
      buttonText,
      buttonOnclick,
      short,
      validationState,
      timer,
      ...rest
    }: TCommonAuthInputProps,
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="flex flex-col w-full gap-2 relative">
        {title && (
          <div className={`font-body1 text-brand-900 select-none`}>{title}</div>
        )}

        <div className="relative w-full">
          <input
            ref={ref}
            type={inputType === "phoneNum" ? "text" : inputType}
            placeholder={placeholder}
            value={value}
            className={`w-full h-13.5 px-5 bg-brand-200 border rounding-15 text-body1 text-brand-900
                        placeholder:text-text-placeholder focus:outline-none transition-colors duration-200
                        ${
                          error
                            ? "border-status-red caret-status-red"
                            : validation
                              ? "border-brand-500"
                              : "border-brand-400 focus:border-status-blue focus:ring-1 focus:ring-status-blue"
                        }
                        ${
                          button || short || validationState || timer
                            ? "pr-25"
                            : "pr-5"
                        }
                        `}
            {...rest}
            onChange={(e) => {
              const rawValue = e.target.value;
              const formatted =
                type === "phoneNum" ? formatInputNumber(rawValue) : rawValue;

              if (rest.onChange) {
                e.target.value = formatted;
                rest.onChange(e);
              }
            }}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-auto text-text-auth-sub" />
              ) : (
                <EyeOffIcon className="w-5 h-auto text-text-auth-sub" />
              )}
            </button>
          )}
          {(button || validationState || timer) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {button && (
                <Button
                  size="small"
                  children={buttonText}
                  disabled={type === "code" ? false : error || !validation}
                  variant={validation ? "dark" : "custom"}
                  className={`py-1! px-3! h-full`}
                  onClick={buttonOnclick}
                  type="button"
                />
              )}
              {validationState && (
                <Button
                  size="small"
                  children={validationState}
                  disabled={!validation}
                  variant={validation ? "dark" : "custom"}
                  className={`py-1! px-3! h-full cursor-default`}
                />
              )}
              {timer && (
                <span className="text-status-red font-body2 mr-3">{timer}</span>
              )}
            </div>
          )}
          {short && (
            <div className="absolute right-0 top-0 h-full w-20 bg-transparent" />
          )}
        </div>

        {error && errorMessage && (
          <div className="font-caption text-status-red pl-1">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

export default CommonAuthInput;
