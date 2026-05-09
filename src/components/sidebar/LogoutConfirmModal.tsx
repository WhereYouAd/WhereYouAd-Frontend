import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";

import LogoutIcon from "@/assets/icon/sidebar/logout.svg?react";

interface ILogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const buttonRowClassName =
  "min-w-0 basis-0 flex-1 tablet:w-full tablet:flex-none tablet:basis-auto";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ILogoutConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      padding="lg"
      title="로그아웃 확인"
      className="mx-4 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
    >
      <div className="flex flex-col items-center px-1 pt-2 pb-1 text-center">
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-component-lg bg-linear-to-br from-chart-3/12 to-chart-5/10 ring-1 ring-chart-3/15"
          aria-hidden
        >
          <LogoutIcon className="h-8 w-8 text-chart-3" />
        </div>

        <h3 className="font-heading2 text-text-main mb-2 tracking-tight">
          로그아웃할까요?
        </h3>
        <p className="font-body1 text-text-auth-sub mb-8 leading-relaxed">
          계정에서 로그아웃하면 다시 로그인해야 <br /> 서비스를 이용할 수
          있어요.
        </p>

        <div
          className="flex w-full max-w-full flex-row gap-3 tablet:flex-col"
          role="group"
          aria-label="로그아웃 확인 동작"
        >
          <Button
            variant="outline"
            size="big"
            aria-label="로그아웃 취소"
            onClick={onClose}
            className={buttonRowClassName}
            type="button"
            disabled={isLoading}
          >
            아니요
          </Button>
          <Button
            variant="danger"
            size="big"
            aria-label="로그아웃 진행"
            onClick={onConfirm}
            className={buttonRowClassName}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "로그아웃 중…" : "로그아웃"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
