import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { TPermissionRow } from "@/types/workspace/workspace";

import Button from "../common/button/Button";
import Card from "../common/card/Card";
import Toggle from "../common/toggle/Toggle";

import CheckIcon from "@/assets/icon/common/check.svg?react";

const permissionRows: TPermissionRow[] = [
  {
    key: "campaignView",
    label: "광고/캠페인 조회",
    description: "광고 및 캠페인을 조회할 수 있습니다",
    defaultMemberEnabled: true,
  },
  {
    key: "billingManage",
    label: "결제 관리",
    description: "구독 플랜 변경 및 결제 수단을 관리합니다",
    defaultMemberEnabled: false,
  },
  {
    key: "workspaceView",
    label: "워크스페이스 조회",
    description: "워크스페이스에 대한 정보를 조회할 수 있습니다",
    defaultMemberEnabled: true,
  },
  {
    key: "memberInvite",
    label: "멤버 초대",
    description: "새로운 팀원을 워크스페이스에 초대할 수 있습니다",
    defaultMemberEnabled: true,
  },
  {
    key: "memberRoleEdit",
    label: "멤버 역할 변경",
    description:
      "워크스페이스에 소속되어있는 멤버들의 역할을 변경할 수 있습니다",
    defaultMemberEnabled: false,
  },
  {
    key: "workspaceEdit",
    label: "워크스페이스 설정 수정",
    description: "워크스페이스 이름, 로고 등 기본 정보를 수정합니다",
    defaultMemberEnabled: false,
  },
  {
    key: "projectDelete",
    label: "프로젝트 삭제",
    description: "생성된 프로젝트를 영구적으로 삭제합니다",
    defaultMemberEnabled: false,
  },
];

type TMemberPermissionState = Record<TPermissionRow["key"], boolean>;

const initialMemberPermissionState: TMemberPermissionState =
  permissionRows.reduce((acc, row) => {
    acc[row.key] = row.defaultMemberEnabled;
    return acc;
  }, {} as TMemberPermissionState);

function AdminCheckBadge() {
  return (
    <div className="inline-flex h-8 w-8 items-center justify-center rounded-3xl bg-primary-100/80">
      <CheckIcon className="h-5 w-5 stroke-2 text-primary-500" />
      <span className="sr-only">가능</span>
    </div>
  );
}

export default function PermissionTable() {
  const [savedPermissionState, setSavedPermissionState] = useState(
    initialMemberPermissionState,
  );
  const [draftPermissionState, setDraftPermissionState] = useState(
    initialMemberPermissionState,
  );
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = useMemo(() => {
    return permissionRows.some(
      (row) => savedPermissionState[row.key] !== draftPermissionState[row.key],
    );
  }, [savedPermissionState, draftPermissionState]);
  const handleToggleMemberPermission = (key: TPermissionRow["key"]) => {
    setDraftPermissionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleResetChange = () => {
    setDraftPermissionState(savedPermissionState);
  };
  const handleSaveChanges = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSavedPermissionState(draftPermissionState);
      toast.success("권한 설정이 저장되었습니다");
    } catch (error) {
      toast.error("권한 설정 저장에 실패했습니다. 다시 시도해주세요");
      console.error("권한 설정 저장 실패", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-8">
      <header className="mb-7">
        <h2 className="font-heading4 text-text-title">권한 설정</h2>
        <p className="mt-2 font-body2 text-text-muted">
          역할별 권한을 확인하고 설정할 수 있습니다
        </p>
      </header>

      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-surface-400">
              <th className="text-text-auth-sub py-2 text-left">
                기능 및 작업
              </th>
              <th className="text-text-auth-sub w-32 py-2 text-center">
                관리자
              </th>
              <th className="text-text-auth-sub w-32 py-2 text-center">멤버</th>
            </tr>
          </thead>
          <tbody>
            {permissionRows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-surface-400 last:border-b-0"
              >
                <td className="py-5">
                  <div className="flex flex-col">
                    <p className="font-label text-text-title">{row.label}</p>
                    <p className="text-text-auth-sub font-body2">
                      {row.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex justify-center">
                    <AdminCheckBadge />
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex justify-center">
                    <Toggle
                      checked={draftPermissionState[row.key]}
                      onToggle={() => handleToggleMemberPermission(row.key)}
                      ariaLabel={`${row.label} 권한 토글`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 border-t border-surface-400/35 pt-6">
        {hasChanges ? (
          <p
            role="status"
            className="mb-4 rounded-xl bg-primary-100/50 px-4 py-3 font-body2 text-text-title"
          >
            <span className="font-label text-primary-500">저장 필요</span>
            <span className="text-text-muted"> · </span>
            멤버 권한이 변경되었습니다. 반영하려면 저장을 눌러주세요. 취소하면
            이전 설정으로 돌아갑니다.
          </p>
        ) : (
          <p className="mb-4 font-body2 text-text-muted">
            멤버 열의 토글을 바꾼 뒤, 아래에서 저장하거나 변경을 취소할 수
            있습니다.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="big"
            onClick={handleResetChange}
            disabled={!hasChanges || isSaving}
            className="rounded-2xl"
          >
            변경 취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="big"
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
            className="rounded-2xl"
          >
            {isSaving ? "저장 중..." : "변경사항 저장하기"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
