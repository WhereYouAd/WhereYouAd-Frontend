import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

type TDropdownSelectProps<T> = {
  options: T[];
  selectedOption: T | null;
  onSelect: (option: T) => void;
  placeholder?: string;
  getOptionKey: (option: T) => string | number;
  getOptionLabel: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
  className?: string;
};

export default function DropdownSelect<T>({
  options,
  selectedOption,
  onSelect,
  placeholder = "선택..",
  getOptionKey,
  getOptionLabel,
  renderOption,
  className,
}: TDropdownSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: T) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={twMerge("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "flex h-14 w-full items-center justify-between rounded-2xl border border-surface-400 bg-surface-100 px-5 font-body1 text-text-title transition-all outline-none",
          isOpen
            ? "border-info-blue ring-1 ring-info-blue"
            : "hover:border-surface-400 focus:border-info-blue focus:ring-1 focus:ring-info-blue",
          !selectedOption && "text-text-placeholder",
        )}
      >
        <span className="truncate text-left">
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <ChevronDownIcon
          className={twMerge(
            "h-4 w-4 shrink-0 transition-transform duration-200 text-text-muted",
            isOpen ? "rotate-0 text-info-blue" : "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-2xl border border-surface-400 bg-surface-100 shadow-lg animate-fade-in">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const key = getOptionKey(option);
              const isSelected =
                selectedOption && getOptionKey(selectedOption) === key;

              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={twMerge(
                      "w-full px-5 py-3 text-left font-body1 text-text-title transition-colors hover:bg-surface-200",
                      isSelected
                        ? "bg-info-blue/5 font-body1 text-info-blue"
                        : "text-text-title",
                    )}
                  >
                    {renderOption
                      ? renderOption(option)
                      : getOptionLabel(option)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
