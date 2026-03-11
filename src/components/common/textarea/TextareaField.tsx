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
      <label className="text-text-main select-none ml-1 mb-2" htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={minRows}
        value={value}
        className={twMerge(
          "w-full resize-none overflow-hidden rounded-component-md bg-gray-50 px-5 py-4 outline-none transition-smooth hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-logo-1/30 text-body1 text-text-main placeholder:text-text-placeholder",
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
