import React, { useEffect, useId, useMemo, useRef, useState } from "react";

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
  /** absolute: 오버레이 / flow: 아래로 밀어내며 컨테이너 높이 증가 */
  listPlacement?: "absolute" | "flow";
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
  listPlacement = "absolute",
}: TSearchSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const listboxId = useId();

  const getOptionLabelRef = useRef(getOptionLabel);

  const [keyword, setKeyword] = useState(
    selectedOption ? getOptionLabel(selectedOption) : "",
  );

  useEffect(() => {
    getOptionLabelRef.current = getOptionLabel;
  }, [getOptionLabel]);

  useEffect(() => {
    setKeyword(selectedOption ? getOptionLabelRef.current(selectedOption) : "");
  }, [selectedOption]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    // capture: 모달 content의 stopPropagation보다 먼저 바깥 클릭을 감지
    document.addEventListener("mousedown", handleOutsideMouseDown, true);
    return () => {
      document.removeEventListener("mousedown", handleOutsideMouseDown, true);
    };
  }, [isOpen, onOpenChange]);

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
    setKeyword(getOptionLabelRef.current(option));
    onOpenChange(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Input
          id={inputId}
          value={keyword}
          onFocus={handleFocus}
          onChange={(e) => handleChangeKeyword(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          containerClassName="h-13 w-full rounded-2xl border border-info-blue font-body1 outline-none transition-colors placeholder:text-text-placeholder focus:border-info-blue"
          inputClassName="truncate"
          rightElement={
            <SearchIcon className="h-5 w-5 text-info-blue" aria-hidden />
          }
        />
      </div>

      {isOpen && (
        <div
          className={
            listPlacement === "flow"
              ? "mt-2 w-full overflow-hidden rounded-2xl border border-surface-400 bg-surface-100 shadow-Soft"
              : "absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-2xl border border-surface-400 bg-surface-100 shadow-Soft"
          }
        >
          {filteredOptions.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-labelledby={inputId}
              className="max-h-60 overflow-y-auto py-2"
            >
              {filteredOptions.map((option) => {
                const optionKey = getOptionKey(option);
                const isSelected =
                  selectedOption !== null &&
                  getOptionKey(selectedOption) === optionKey;

                return (
                  <li key={optionKey} role="presentation">
                    <button
                      id={`${listboxId}-option-${optionKey}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      className="w-full py-2 text-left hover:bg-surface-200"
                    >
                      {renderOption(option)}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="px-4 py-5 font-body2 text-text-auth-sub"
            >
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
