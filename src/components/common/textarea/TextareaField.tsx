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
        <label className="text-text-title select-none ml-1 mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={minRows}
        value={value}
        className={twMerge(
          "w-full rounded-2xl px-5 py-4 ring-1 ring-primary-400/30 outline-none transition-colors duration-200 ease-out overflow-hidden placeholder:text-text-placeholder text-text-title font-body1",
          disabled
            ? "bg-surface-200 cursor-not-allowed"
            : "hover:bg-surface-200 hover:ring-primary-400/40 focus-within:bg-surface-100 focus-within:ring-2 focus-within:ring-primary-400/50",
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
