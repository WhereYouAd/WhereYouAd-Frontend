import ReactMarkdown, { type Components } from "react-markdown";

type TAgreementItemProps = {
  label: string;
  required?: boolean;
  checked: boolean;
  expanded: boolean;
  onToggleCheck: () => void;
  onToggleExpand: () => void;
  content: string;
};

const markdownComponents: Components = {
  h2: ({ ...props }) => (
    <h2
      className="font-heading4 text-text-title mb-2 mt-4 first:mt-0"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3 className="font-body1 text-text-auth-sub mb-1 mt-3" {...props} />
  ),
  p: ({ ...props }) => (
    <p className="mb-3 font-body2 text-text-body last:mb-0" {...props} />
  ),
  ul: ({ ...props }) => (
    <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
  ),
  li: ({ ...props }) => (
    <li className="pl-1 marker:text-text-disabled" {...props} />
  ),
};

export default function AgreementItem({
  label,
  required,
  checked,
  expanded,
  onToggleCheck,
  onToggleExpand,
  content,
}: TAgreementItemProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onToggleCheck}
          role="checkbox"
          aria-checked={checked}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleCheck();
            }
          }}
        >
          <input
            type="checkbox"
            className="checkbox"
            checked={checked}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
          />
          <span className="font-body2 text-text-title flex items-center gap-1">
            {label}
            <span
              className={`font-caption ${
                required ? "text-primary-500" : "text-text-auth-sub"
              }`}
            >
              ({required ? "필수" : "선택"})
            </span>
          </span>
        </div>
        <button
          onClick={onToggleExpand}
          className="font-body2 text-text-auth-sub underline hover:text-text-title"
          aria-expanded={expanded}
          aria-label={`${label} 상세 내용 ${expanded ? "접기" : "보기"}`}
        >
          {expanded ? "접기" : "보기"}
        </button>
      </div>

      {expanded && (
        <div className="max-h-50 overflow-y-auto rounded-2xl bg-surface-200 p-5 font-body2 text-text-auth-sub">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
