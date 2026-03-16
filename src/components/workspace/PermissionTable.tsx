import { useState } from "react";

import type { TPermissionRow } from "@/types/workspace/workspace";

import Toggle from "../common/toggle/Toggle";

import CheckIcon from "@/assets/icon/common/check.svg?react";

const permissionRows: TPermissionRow[] = [
  {
    key: "campaignView",
    label: "광고/캠페인 조회",
    description: "광고 및 캠페인을 조회할 수 있습니다",
    admin: "가능",
    member: "가능",
  },
  {
    key: "billingManage",
    label: "결제 관리",
    description: "구독 플랜 변경 및 결제 수단을 관리합니다",
    admin: "가능",
    member: "불가능",
  },
  {
    key: "workspaceView",
    label: "워크스페이스 조회",
    description: "워크스페이스에 대한 정보를 조회할 수 있습니다",
    admin: "가능",
    member: "가능",
  },
  {
    key: "memberInvite",
    label: "멤버 초대",
    description: "새로운 팀원을 워크스페이스에 초대할 수 있습니다",
    admin: "가능",
    member: "불가능",
  },
  {
    key: "memberRoleEdit",
    label: "멤버 역할 변경",
    description:
      "워크스페이스에 소속되어있는 멤버들의 역할을 변경할 수 있습니다",
    admin: "가능",
    member: "불가능",
  },
  {
    key: "workspaceEdit",
    label: "워크스페이스 설정 수정",
    description: "워크스페이스 이름, 로고 등 기본 정보를 수정합니다",
    admin: "가능",
    member: "불가능",
  },
  {
    key: "projectDelete",
    label: "프로젝트 삭제",
    description: "생성된 프로젝트를 영구적으로 삭제합니다",
    admin: "가능",
    member: "가능",
  },
];

type TMemberPermissionState = Record<TPermissionRow["key"], boolean>;

const initialMemberPermissionState: TMemberPermissionState =
  permissionRows.reduce((acc, row) => {
    acc[row.key] = row.member === "가능";
    return acc;
  }, {} as TMemberPermissionState);

function AdminCheckBadge() {
  return (
    <div className="inline-flex w-8 h-8 bg-chart-5/15 justify-center items-center rounded-component-lg">
      <CheckIcon className="w-5 h-5 text-chart-3 stroke-2" />
      <span className="sr-only">가능</span>
    </div>
  );
}

export default function PermissionTable() {
  const [memberPermissionState, setMemberPermissionState] = useState(
    initialMemberPermissionState,
  );
  const handleToggleMemberPermission = (key: TPermissionRow["key"]) => {
    setMemberPermissionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <header className="mb-7">
        <h2 className="font-heading4 text-text-main font-semibold!">
          권한 설정
        </h2>
        <p className="font-body2 text-text-sub mt-2">
          역할별로 수행할 수 있는 작업을 상세하게 설정합니다
        </p>
      </header>

      <div className="overflow-hidden">
        <table className="w-full border-collapse table-fixed">
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
                      checked={memberPermissionState[row.key]}
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
    </div>
  );
}
