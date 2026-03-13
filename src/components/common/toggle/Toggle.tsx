import { twMerge } from "tailwind-merge";

type TToggleProps = {
  checked: boolean;
  onToggle: () => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  thumbClassName?: string;
};

export default function Toggle({
  checked,
  onToggle,
  ariaLabel,
  disabled = false,
  className,
  thumbClassName,
}: TToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      className={twMerge(
        "relative inline-flex h-8 w-15 items-center rounded-full transition-colors",
        checked ? "bg-chart-3" : "bg-gray-200",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span
        className={twMerge(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-7.5" : "translate-x-1.5",
          thumbClassName,
        )}
      />
    </button>
  );
}
