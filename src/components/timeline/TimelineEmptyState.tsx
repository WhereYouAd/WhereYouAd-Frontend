import Button from "@/components/common/button/Button";

import PlusIcon from "@/assets/icon/common/plus.svg?react";

interface ITimelineEmptyStateProps {
  onCreate: () => void;
}

export default function TimelineEmptyState({
  onCreate,
}: ITimelineEmptyStateProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="font-heading4 text-text-title">아직 타임라인이 없어요</p>
      <p className="max-w-sm font-body2 text-text-muted">
        타임라인 생성으로 첫 기간을 만들어보세요
      </p>
      <Button
        type="button"
        size="small"
        variant="primary"
        onClick={onCreate}
        leftIcon={<PlusIcon className="h-4 w-4 shrink-0" aria-hidden />}
        className="mt-1 rounded-2xl px-5"
      >
        타임라인 생성
      </Button>
    </div>
  );
}
