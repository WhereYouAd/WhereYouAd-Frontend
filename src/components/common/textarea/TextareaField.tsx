import type React from "react";
import { useLayoutEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

type TProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  minRows?: number;
  disabled?: boolean;
};

export default function TextareaField({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
  disabled = false,
  minRows = 4,
}: TProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useLayoutEffect(() => {
    resize();
  }, [value]);

  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-text-main select-none ml-1 mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={minRows}
        value={value}
        className={twMerge(
          "w-full rounded-component-md px-5 py-4 ring-1 ring-logo-1/30 outline-none transition-colors duration-200 ease-out overflow-hidden placeholder:text-text-placeholder text-text-main font-body1",
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "hover:bg-gray-100 hover:ring-logo-1/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-logo-1/50",
          className,
        )}
        placeholder={placeholder}
        onChange={onChange}
        onInput={resize}
        disabled={disabled}
      />
    </div>
  );
}
