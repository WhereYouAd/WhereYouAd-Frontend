import React, { useState } from "react";

import formatPhoneNumber from "@/utils/formatPhoneNumber";

import Input, { type IInputProps } from "@/components/common/input/Input";

import InputActions from "./InputActions";

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
  onButtonClick?: () => void;
  timer?: string;
} & Omit<
  IInputProps,
  | "label"
  | "helperText"
  | "success"
  | "rightElement"
  | "error"
  | "containerClassName"
>;

const CommonAuthInput = React.forwardRef<
  HTMLInputElement,
  TCommonAuthInputProps
>(
  (
    {
      type,
      title,
      validation = false,
      error,
      errorMessage,
      button,
      buttonText,
      onButtonClick,
      validationState,
      timer,
      onChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" && showPassword ? "text" : type;
    const isPhoneNum = type === "tel";

    const renderRightElement = () => {
      if (type === "password") {
        return (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="flex items-center justify-center w-6 h-6 outline-none mr-2"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-auto text-text-auth-sub" />
            ) : (
              <EyeOffIcon className="w-5 h-auto text-text-auth-sub" />
            )}
          </button>
        );
      }

      return (
        <InputActions
          button={button}
          buttonText={buttonText}
          onButtonClick={onButtonClick}
          validationState={validationState}
          timer={timer}
          validation={validation}
          error={error}
          type={type}
        />
      );
    };

    return (
      <Input
        ref={ref}
        type={isPhoneNum ? "tel" : inputType}
        label={title}
        helperText={errorMessage}
        error={error}
        success={validation}
        rightElement={renderRightElement()}
        containerClassName={className}
        onChange={(e) => {
          const rawValue = e.target.value;
          const formatted = isPhoneNum ? formatPhoneNumber(rawValue) : rawValue;

          if (onChange) {
            const newEvent = {
              ...e,
              target: {
                ...e.target,
                value: formatted,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(newEvent);
          }
        }}
        {...rest}
      />
    );
  },
);

export default CommonAuthInput;
