import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { TPermissionRow } from "@/types/workspace/workspace";

import Button from "../common/button/Button";
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
    <div className="inline-flex w-8 h-8 bg-chart-5/15 justify-center items-center rounded-3xl">
      <CheckIcon className="w-5 h-5 text-chart-3 stroke-2" />
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
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-Soft">
      <header className="mb-7">
        <h2 className="font-heading4 text-text-main font-semibold!">
          권한 설정
        </h2>
        <p className="font-body2 text-text-sub mt-2">
          역할별 권한을 확인하고 설정할 수 있습니다
        </p>
      </header>

      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-100">
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
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="py-5">
                  <div className="flex flex-col">
                    <p className="text-text-main font-semibold">{row.label}</p>
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
      <div className="flex gap-3 items-center justify-end mt-5">
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
  );
}
