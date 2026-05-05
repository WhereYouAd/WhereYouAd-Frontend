import { lazy, Suspense } from "react";

import Drawer from "@/components/common/drawer/Drawer";

import DownloadIcon from "@/assets/icon/common/download.svg?react";
import LinkIcon from "@/assets/icon/common/link.svg?react";

const OverviewAiReportPanel = lazy(() => import("./OverviewAiReportPanel"));

export function OverviewAiDrawer({
  isOpen,
  onClose,
  onShareLink,
  onDownloadPdf,
}: {
  isOpen: boolean;
  onClose: () => void;
  onShareLink: () => void;
  onDownloadPdf: () => void;
}) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      hideHeader={false}
      disableScroll={false}
      className="w-full max-w-160"
      dropdownItems={[
        {
          label: "링크 공유하기",
          icon: (
            <LinkIcon
              className="text-text-auth-sub transition-colors group-hover:text-status-blue"
              width={20}
              height={20}
            />
          ),
          onClick: onShareLink,
        },
        {
          label: "PDF로 저장하기",
          icon: (
            <DownloadIcon
              className="text-text-auth-sub transition-colors group-hover:text-status-blue"
              width={20}
              height={20}
            />
          ),
          onClick: onDownloadPdf,
        },
      ]}
    >
      {isOpen && (
        <Suspense fallback={null}>
          <OverviewAiReportPanel />
        </Suspense>
      )}
    </Drawer>
  );
}
