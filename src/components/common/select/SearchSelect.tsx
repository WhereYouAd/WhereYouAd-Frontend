import React, { useEffect, useMemo, useRef, useState } from "react";

import Input from "../input/Input";

import SearchIcon from "@/assets/icon/common/search.svg?react";

type TSearchSelectProps<T> = {
  options: T[];
  selectedOption: T | null;
  onSelect: (option: T) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  getOptionKey: (option: T) => string | number;
  getOptionLabel: (option: T) => string;
  getSearchText: (option: T) => string;
  renderOption: (option: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
};

export default function SearchSelect<T>({
  options,
  selectedOption,
  onSelect,
  isOpen,
  onOpenChange,
  placeholder = "검색하세요",
  getOptionKey,
  getOptionLabel,
  getSearchText,
  renderOption,
  emptyMessage = "검색 결과가 없습니다.",
  className = "",
}: TSearchSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState(
    selectedOption ? getOptionLabel(selectedOption) : "",
  );

  useEffect(() => {
    setKeyword(selectedOption ? getOptionLabel(selectedOption) : "");
  }, [selectedOption, getOptionLabel]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onOpenChange]);

  const filteredOptions = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    if (!trimmedKeyword) {
      return options;
    }

    return options.filter((option) =>
      getSearchText(option).toLowerCase().includes(trimmedKeyword),
    );
  }, [getSearchText, keyword, options]);

  const handleFocus = () => {
    onOpenChange(true);
  };

  const handleChangeKeyword = (value: string) => {
    setKeyword(value);
    onOpenChange(true);
  };

  const handleSelect = (option: T) => {
    onSelect(option);
    setKeyword(getOptionLabel(option));
    onOpenChange(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Input
          value={keyword}
          onFocus={handleFocus}
          onChange={(e) => handleChangeKeyword(e.target.value)}
          placeholder={placeholder}
          className="h-13 w-full rounded-component-md border border-status-blue px-4 pl-5 font-body1 outline-none transition-colors placeholder:text-text-placeholder focus:border-status-blue"
        />
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-status-blue" />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-component-md border border-gray-200 bg-white shadow-sm">
          {filteredOptions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-2">
              {filteredOptions.map((option) => (
                <li key={getOptionKey(option)}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full text-left hover:bg-gray-50"
                  >
                    {renderOption(option)}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 font-body2 text-text-sub">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
