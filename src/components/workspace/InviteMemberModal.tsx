import { useState } from "react";
import { toast } from "sonner";

import type {
  TInviteMemberItem,
  TInviteMemberRequest,
} from "@/types/workspace/workspace";

import { emailSchema } from "@/utils/auth/validation";

import { useCoreMutation } from "@/hooks/customQuery";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

import { postInviteEmail } from "@/api/workspace/org";
import MailIcon from "@/assets/icon/common/mail.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";
import { QUERY_KEYS } from "@/lib/queryKeys";

type TInviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  inviteItems: TInviteMemberItem[];
};

export default function InviteMemberModal({
  isOpen,
  onClose,
  orgId,
  inviteItems,
}: TInviteMemberModalProps) {
  const [form, setForm] = useState<TInviteMemberRequest>({ email: "" });
  const trimmedEmail = form.email.trim();
  const emailValidation = emailSchema.safeParse(trimmedEmail);
  const isValidEmail = emailValidation.success;

  const inviteMutation = useCoreMutation(
    (body: TInviteMemberRequest) => postInviteEmail(orgId, body),
    {
      invalidateKeys: [
        QUERY_KEYS.workspace.pendingMembers(orgId),
        QUERY_KEYS.workspace.members(orgId),
        QUERY_KEYS.workspace.memberCount(orgId),
      ],
      userOnSuccess: () => {
        toast.success("초대 이메일을 발송했습니다");
        setForm({ email: "" });
      },
      userOnError: (error) => {
        toast.error(error.message ?? "초대 이메일 발송에 실패했습니다");
      },
    },
  );

  const isInviteDisabled = !isValidEmail || inviteMutation.isPending;

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
      <div className="flex flex-col h-full max-h-[80vh] text-center px-2 py-6 tablet:py-4">
        <div className="flex justify-center items-center py-6 pb-3 gap-3">
          <MailIcon className="h-6 w-6 text-primary-400" />
          <p className="font-heading4 text-text-title">팀원 초대하기</p>
        </div>
        <div className="px-8 py-4 shrink-0 tablet:px-5">
          <div className="flex items-center gap-7 tablet:flex-col tablet:items-stretch tablet:gap-3">
            <div className="flex-1 tablet:w-full">
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
              className="min-w-22 tablet:w-full"
            >
              {inviteMutation.isPending ? "초대 중..." : "초대"}
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-4 tablet:px-5">
          <ul>
            {inviteItems.map((item) => {
              if (item.inviteStatus === "PENDING") {
                return (
                  <li
                    key={`pending-${item.invitationId}`}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex bg-text-placeholder/30 h-12 w-12 items-center justify-center shrink-0 rounded-3xl overflow-hidden">
                        <UserIcon className="text-text-auth-sub h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-body2 text-text-muted">
                          {item.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <Badge
                        variant="surface"
                        className="bg-text-placeholder/50"
                      >
                        가입 대기 중
                      </Badge>
                    </div>
                  </li>
                );
              }
              return (
                <li
                  key={`active-${item.memberId}`}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex bg-text-placeholder/30 h-12 w-12 items-center justify-center shrink-0 rounded-3xl overflow-hidden">
                      {item.profileImageUrl ? (
                        <img
                          src={item.profileImageUrl}
                          alt={`${item.name} 프로필 이미지`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="text-text-auth-sub h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="truncate font-body1 text-text-title">
                          {item.name}
                        </p>
                        {item.isMe && (
                          <span className="font-body2 text-text-disabled">
                            본인
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <span className="text-text-title">
                      {item.role === "ADMIN" ? "관리자" : "멤버"}
                    </span>
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
