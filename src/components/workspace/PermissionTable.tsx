import type { TPermissionRow } from "@/types/workspace/workspace";

import Card from "../common/card/Card";

import CheckIcon from "@/assets/icon/common/check.svg?react";
import CloseIcon from "@/assets/icon/common/close.svg?react";

const permissionRows: TPermissionRow[] = [
  {
    key: "campaignView",
    label: "광고/캠페인 조회",
    description: "광고 및 캠페인을 조회할 수 있습니다",
    memberAllowed: true,
  },
  {
    key: "timelineManage",
    label: "타임라인 조회/관리",
    description: "성과 타임라인을 조회하고 생성•수정•삭제할 수 있습니다",
    memberAllowed: true,
  },
  {
    key: "billingManage",
    label: "결제 관리",
    description: "구독 플랜 변경 및 결제 수단을 관리합니다",
    memberAllowed: false,
  },
  {
    key: "workspaceView",
    label: "워크스페이스 조회",
    description: "워크스페이스에 대한 정보를 조회할 수 있습니다",
    memberAllowed: true,
  },
  {
    key: "memberInvite",
    label: "멤버 초대",
    description: "새로운 팀원을 워크스페이스에 초대할 수 있습니다",
    memberAllowed: false,
  },
  {
    key: "memberRoleEdit",
    label: "멤버 역할 변경",
    description:
      "워크스페이스에 소속되어있는 멤버들의 역할을 변경할 수 있습니다",
    memberAllowed: false,
  },
  {
    key: "workspaceEdit",
    label: "워크스페이스 설정 수정",
    description: "워크스페이스 이름•로고 등 기본 정보를 수정합니다",
    memberAllowed: false,
  },
  {
    key: "projectDelete",
    label: "프로젝트 삭제",
    description: "생성된 프로젝트를 영구적으로 삭제합니다",
    memberAllowed: false,
  },
];

function PermissionAllowedBadge() {
  return (
    <div
      className="inline-flex h-8 w-8 items-center justify-center rounded-3xl bg-primary-100/80"
      aria-label="가능"
    >
      <CheckIcon
        className="h-5 w-5 stroke-2 text-primary-500"
        aria-hidden="true"
      />
    </div>
  );
}
function PermissionDeniedBadge() {
  return (
    <div
      className="inline-flex h-8 w-8 items-center justify-center rounded-3xl bg-surface-300/80"
      aria-label="불가능"
    >
      <CloseIcon
        className="h-4.5 w-4.5 [&_path]:stroke-[2.5] text-info-red"
        aria-hidden="true"
      />
    </div>
  );
}

export default function PermissionTable() {
  return (
    <Card className="p-8 tablet:p-6">
      <header className="mb-7">
        <h2 className="font-heading4 text-text-title">권한 설정</h2>
        <p className="mt-2 font-body2 text-text-muted break-keep">
          역할(관리자•멤버)에 따른 권한을 확인할 수 있습니다
        </p>
      </header>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed min-w-130 tablet:min-w-0">
          <thead>
            <tr className="border-b border-surface-400">
              <th className="text-text-auth-sub py-2 text-left">
                기능 및 작업
              </th>
              <th className="text-text-auth-sub w-32 py-2 text-center tablet:w-20">
                관리자
              </th>
              <th className="text-text-auth-sub w-32 py-2 text-center tablet:w-20">
                멤버
              </th>
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
                    <p className="font-label text-text-title break-keep">
                      {row.label}
                    </p>
                    <p className="text-text-auth-sub font-body2 break-keep">
                      {row.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 text-center tablet:px-2">
                  <div className="flex justify-center">
                    <PermissionAllowedBadge />
                  </div>
                </td>
                <td className="px-6 py-5 text-center tablet:px-2">
                  <div className="flex justify-center">
                    {row.memberAllowed ? (
                      <PermissionAllowedBadge />
                    ) : (
                      <PermissionDeniedBadge />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl bg-surface-200/60 px-5 py-5 tablet:px-4 tablet:py-4">
        <p className="font-body2 text-text-muted break-keep text-pretty">
          권한은 역할에 따라 고정됩니다. 멤버의 접근 범위를 바꾸려면 위 멤버
          목록에서 역할을 변경하세요.
        </p>
      </div>
    </Card>
  );
}
