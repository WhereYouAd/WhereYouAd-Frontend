import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type {
  TInviteMemberItem,
  TInviteMemberRequest,
} from "@/types/workspace/workspace";

import { emailSchema } from "@/utils/validation";

import Badge from "../common/badge/Badge";
import Button from "../common/button/Button";
import Input from "../common/input/Input";
import Modal from "../common/modal/Modal";

import { postInviteEmail } from "@/api/workspace/org";
import CopyIcon from "@/assets/icon/common/link.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";

type TInviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  inviteItems: TInviteMemberItem[];
  onInviteSuccess: (email: string) => void;
};

export default function InviteMemberModal({
  isOpen,
  onClose,
  orgId,
  inviteItems,
  onInviteSuccess,
}: TInviteMemberModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<TInviteMemberRequest>({ email: "" });
  const trimmedEmail = form.email.trim();
  const emailValidation = emailSchema.safeParse(trimmedEmail);
  const isValidEmail = emailValidation.success;

  const inviteMutation = useMutation<
    unknown,
    IApiErrorResponse,
    TInviteMemberRequest
  >({
    mutationFn: (body) => postInviteEmail(orgId, body),
    onSuccess: (_, variables) => {
      toast.success("초대 이메일을 발송했습니다");
      onInviteSuccess(variables.email);
      setForm({ email: "" });
      void queryClient.invalidateQueries({
        queryKey: ["workspaceMembers", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["workspaceMemberCount", orgId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isInviteDisabled = !isValidEmail || inviteMutation.isPending;

  const inviteLink = useMemo(() => {
    return `${window.location.origin}/workspace/${orgId}/invite`;
  }, [orgId]);
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("초대 링크가 복사되었습니다");
    } catch (error) {
      toast.error("초대 링크 복사에 실패했습니다. 다시 시도해주세요");
      console.log("초대 링크 복사 실패:", error);
    }
  };
  const handleChangeEmail = (value: string) => {
    setForm({ email: value });
  };

  const handleInvite = async () => {
    if (!emailValidation.success) {
      toast.error(
        emailValidation.error.issues[0]?.message ??
          "올바른 이메일을 입력해주세요",
      );
      return;
    }
    try {
      await inviteMutation.mutateAsync({
        email: emailValidation.data,
      });
    } catch (error) {
      console.error("초대 실패", error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={inviteMutation.isPending ? () => {} : onClose}
      size="lg"
      padding="none"
      title="팀원 초대하기"
      className="w-full max-w-190 overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[80vh] text-center px-2 py-6">
        <div className="flex justify-between items-center px-8 py-6 pb-3 shrink-0">
          <p className="font-heading4">팀원 초대하기</p>
          <button
            type="button"
            aria-label="팀원 초대 링크 복사 버튼"
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-component-sm px-2 py-1 text-chart-3 transition-opacity hover:opacity-80"
          >
            <CopyIcon />
            <span className="font-body1">링크 복사</span>
          </button>
        </div>
        <div className="px-8 py-4 shrink-0">
          <div className="flex items-center gap-7">
            <div className="flex-1">
              <Input
                value={form.email}
                placeholder="이메일을 입력해서 팀원을 초대하세요"
                onChange={(e) => handleChangeEmail(e.target.value)}
                disabled={inviteMutation.isPending}
              />
            </div>
            <Button
              type="button"
              aria-label="팀원 초대 버튼"
              variant="primary"
              size="big"
              onClick={handleInvite}
              disabled={isInviteDisabled}
              className="min-w-22"
            >
              {inviteMutation.isPending ? "초대 중..." : "초대"}
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-4">
          <ul>
            {inviteItems.map((item) => {
              const isPending = item.inviteStatus === "PENDING";
              const displayName = item.name ?? item.email;

              return (
                <li
                  key={item.email}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex bg-text-placeholder/30 h-12 w-12 items-center justify-center shrink-0 rounded-component-lg overflow-hidden">
                      {item.profileImageUrl ? (
                        <img
                          src={item.profileImageUrl}
                          alt={`${displayName} 프로필 이미지`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="text-text-auth-sub h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      {isPending ? (
                        <p className="truncate text-sm text-text-sub">
                          {item.email}
                        </p>
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="truncate font-body1 text-text-main">
                            {item.name}
                          </p>
                          {item.isMe && (
                            <span className="font-body2 text-text-disabled">
                              (you)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center">
                    {isPending ? (
                      <Badge
                        variant="stopped"
                        size="md"
                        className="bg-text-placeholder/60"
                      >
                        가입 대기 중
                      </Badge>
                    ) : (
                      <span className="text-text-main">
                        {item.role === "ADMIN" ? "관리자" : "멤버"}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
