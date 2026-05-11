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
          "flex items-center justify-between w-full h-14 px-5 bg-white border border-bg-disabled rounded-2xl text-body1 transition-all outline-none",
          isOpen
            ? "border-status-blue ring-1 ring-status-blue"
            : "hover:border-text-disabled focus:border-status-blue focus:ring-1 focus:ring-status-blue",
          !selectedOption && "text-text-placeholder",
        )}
      >
        <span className="truncate text-left">
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <ChevronDownIcon
          className={twMerge(
            "w-4 h-4 transition-transform duration-200 text-text-sub",
            isOpen ? "rotate-0 text-status-blue" : "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-2xl border border-bg-disabled bg-white shadow-lg animate-fade-in">
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
                      "w-full px-5 py-3 text-left text-body1 transition-colors hover:bg-text-placeholder/20",
                      isSelected
                        ? "text-status-blue font-bold bg-status-blue/5"
                        : "text-text-main",
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
