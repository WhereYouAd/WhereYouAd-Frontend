import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import {
  type TGetWorkspaceMembersData,
  type TMemberRole,
  type TUpdateMemberRoleRequest,
  type TWorkspaceMember,
} from "@/types/workspace/workspace";

import {
  useCoreInfiniteQuery,
  useCoreMutation,
  useCoreQuery,
} from "@/hooks/customQuery";
import { useNotificationMembers } from "@/hooks/setting/useNotificationMembers";
import { useUpdateNotificationMembers } from "@/hooks/setting/useUpdateNotificationMembers";

import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import DeleteMemberModal from "@/components/workspace/DeleteMemberModal";
import MemberList from "@/components/workspace/MemberList";
import MemberManagementLoading from "@/components/workspace/MemberManagementLoading";
import PermissionTable from "@/components/workspace/PermissionTable";

import {
  deleteWorkspaceMember,
  getPendingMember,
  getWorkspaceMemberCount,
  getWorkspaceMembers,
  updateWorkspaceMemberPermission,
} from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";

const PAGE_SIZE = 20;

export default function MemberManagement() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const orgId = Number(workspaceId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteMember, setSelectedDeleteMember] =
    useState<TWorkspaceMember | null>(null);

  const [updatingMemberId, setUpdatingMemberId] = useState<number | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const notificationMembersQuery = useNotificationMembers(orgId);

  const memberCountQuery = useCoreQuery(
    QUERY_KEYS.workspace.memberCount(orgId),
    () => getWorkspaceMemberCount(orgId),
    { enabled: Number.isFinite(orgId) && orgId > 0 },
  );

  const membersQuery = useCoreInfiniteQuery<TGetWorkspaceMembersData>(
    QUERY_KEYS.workspace.membersWithPageSize(orgId, PAGE_SIZE),
    ({ pageParam }) => getWorkspaceMembers(orgId, pageParam, PAGE_SIZE),
    {
      initialPageParam: null,
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNext) return undefined;
        return lastPage.nextCursor;
      },
      enabled: Number.isFinite(orgId) && orgId > 0,
    },
  );

  const members = useMemo(() => {
    return membersQuery.data?.pages.flatMap((page) => page.members) ?? [];
  }, [membersQuery.data]);

  const creatorId = membersQuery.data?.pages[0]?.creatorId ?? null;

  const totalCount = memberCountQuery?.data?.totalCount ?? 0;

  const adminCount = useMemo(() => {
    return members.filter((member) => member.role === "ADMIN").length;
  }, [members]);

  const pendingMembersQuery = useCoreQuery(
    QUERY_KEYS.workspace.pendingMembers(orgId),
    () => getPendingMember(orgId),
    { enabled: Number.isFinite(orgId) && orgId > 0 },
  );

  const pendingMembers = useMemo(() => {
    const items = pendingMembersQuery.data?.pendingMembers ?? [];

    return [...items].sort(
      (a, b) =>
        new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime(),
    );
  }, [pendingMembersQuery.data]);

  const updateMemberRoleMutation = useCoreMutation(
    ({
      memberId,
      body,
    }: {
      memberId: number;
      body: TUpdateMemberRoleRequest;
    }) => updateWorkspaceMemberPermission(orgId, memberId, body),
    {
      invalidateKeys: [QUERY_KEYS.workspace.members(orgId)],
      userOnError: (error) => {
        toast.error(error.message ?? "권한 변경에 실패했습니다");
      },
    },
  );

  const deleteMemberMutation = useCoreMutation(
    (memberId: number) => deleteWorkspaceMember(orgId, memberId),
    {
      invalidateKeys: [
        QUERY_KEYS.workspace.members(orgId),
        QUERY_KEYS.workspace.memberCount(orgId),
      ],
      userOnError: (error) => {
        toast.error(error.message ?? "멤버 삭제에 실패했습니다");
      },
    },
  );

  const notificationReceiveByEmail = useMemo(() => {
    const map = new Map<string, { membershipId: number; isReceive: boolean }>();
    const pages = notificationMembersQuery.data?.pages ?? [];
    for (const page of pages) {
      for (const m of page.members) {
        map.set(m.email, {
          membershipId: m.membershipId,
          isReceive: m.isReceive,
        });
      }
    }
    return map;
  }, [notificationMembersQuery.data]);

  // 로드된 멤버 중 알림 매칭이 비어 있으면 알림 목록 다음 페이지를 계속 가져옴
  useEffect(() => {
    if (members.length === 0) return;
    if (!notificationMembersQuery.hasNextPage) return;
    if (
      notificationMembersQuery.isLoading ||
      notificationMembersQuery.isFetchingNextPage
    ) {
      return;
    }

    const hasMissingReceive = members.some(
      (member) => !notificationReceiveByEmail.has(member.email),
    );
    if (!hasMissingReceive) return;

    void notificationMembersQuery.fetchNextPage();
  }, [
    members,
    notificationReceiveByEmail,
    notificationMembersQuery.hasNextPage,
    notificationMembersQuery.isLoading,
    notificationMembersQuery.isFetchingNextPage,
    notificationMembersQuery.fetchNextPage,
  ]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;
    if (!membersQuery.hasNextPage && !notificationMembersQuery.hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;

        if (membersQuery.hasNextPage && !membersQuery.isFetchingNextPage) {
          void membersQuery.fetchNextPage();
        }
        if (
          notificationMembersQuery.hasNextPage &&
          !notificationMembersQuery.isFetchingNextPage
        ) {
          void notificationMembersQuery.fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "120px",
        threshold: 0,
      },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [
    membersQuery.hasNextPage,
    membersQuery.isFetchingNextPage,
    membersQuery.fetchNextPage,
    notificationMembersQuery.hasNextPage,
    notificationMembersQuery.isFetchingNextPage,
    notificationMembersQuery.fetchNextPage,
  ]);

  const handleRoleChange = async (
    targetMemberId: number,
    newRole: TMemberRole,
  ) => {
    const targetMember = members.find(
      (member) => member.memberId === targetMemberId,
    );

    if (!targetMember) return;
    if (targetMember.role === newRole) return;

    if (targetMember.isMe) {
      toast.error("본인 권한은 여기서 변경할 수 없습니다");
      return;
    }

    const isLastAdminDemotion =
      targetMember.role === "ADMIN" && newRole === "MEMBER" && adminCount === 1;

    if (isLastAdminDemotion) {
      toast.error(
        "관리자는 최소 1명 이상이어야 합니다. 다른 멤버를 먼저 관리자로 지정한 후 다시 시도해 주세요",
      );
      return;
    }
    try {
      await updateMemberRoleMutation.mutateAsync({
        memberId: targetMemberId,
        body: { orgRole: newRole },
      });
      toast.success(
        `${targetMember.name}님의 권한이 ${newRole === "ADMIN" ? "관리자" : "멤버"}로 변경되었습니다`,
      );
    } catch (error) {
      console.error("권한 변경 실패", error);
    }
  };

  const openDeleteMember = (member: TWorkspaceMember) => {
    if (member.isMe) {
      toast.error("본인 계정은 삭제할 수 없습니다");
      return;
    }

    const isLastAdmin = member.role === "ADMIN" && adminCount === 1;
    if (isLastAdmin) {
      toast.error("마지막 관리자는 삭제할 수 없습니다");
      return;
    }

    setSelectedDeleteMember(member);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteMember = () => {
    if (deleteMemberMutation.isPending) return;
    setIsDeleteModalOpen(false);
    setSelectedDeleteMember(null);
  };

  const handleDeleteMember = async (member: TWorkspaceMember) => {
    try {
      await deleteMemberMutation.mutateAsync(member.memberId);
      toast.success(`${member.name}님이 삭제되었습니다`);
      setIsDeleteModalOpen(false);
      setSelectedDeleteMember(null);
    } catch (error) {
      console.error("팀원 삭제 실패", error);
    }
  };
  const updateNotificationMembersMutation = useUpdateNotificationMembers(orgId);

  const handleReceiveToggle = async (email: string, memberId: number) => {
    const current = notificationReceiveByEmail.get(email);
    if (!current) return;

    setUpdatingMemberId(memberId);
    try {
      await updateNotificationMembersMutation.mutateAsync({
        members: [
          {
            membershipId: current.membershipId,
            isReceive: !current.isReceive,
          },
        ],
      });
      toast.success(
        !current.isReceive
          ? "알림 수신이 켜졌습니다"
          : "알림 수신이 꺼졌습니다",
      );
    } catch (e) {
      const error = e as IApiErrorResponse;
      toast.error(error.message ?? "알림 수신 변경에 실패했습니다");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  if (!Number.isFinite(orgId) || orgId <= 0) {
    return (
      <section className="w-full min-w-0">
        <header className="mb-7">
          <h1 className="font-heading2 text-text-title">멤버 관리</h1>
          <p className="font-body1 text-info-red">
            올바르지 않은 워크스페이스입니다.
          </p>
        </header>
      </section>
    );
  }

  if (
    memberCountQuery.isLoading ||
    membersQuery.isLoading ||
    pendingMembersQuery.isLoading
  ) {
    return <MemberManagementLoading />;
  }

  if (
    memberCountQuery.isError ||
    membersQuery.isError ||
    pendingMembersQuery.isError
  ) {
    const errorMessage =
      memberCountQuery.error?.message ||
      (membersQuery.error as unknown as IApiErrorResponse)?.message ||
      pendingMembersQuery.error?.message ||
      "팀 구성원 정보를 불러오지 못했습니다";

    return (
      <section className="w-full min-w-0">
        <header className="mb-7">
          <h1 className="font-heading2 text-text-title">멤버 관리</h1>
          <p className="font-body1 text-info-red">{errorMessage}</p>
        </header>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 flex flex-col gap-8">
      <ErrorBoundary
        FallbackComponent={AreaErrorFallback}
        resetKeys={[members, pendingMembers]}
      >
        <div className="flex w-full min-w-0 flex-col gap-8">
          <MemberList
            orgId={orgId}
            members={members}
            creatorId={creatorId}
            pendingMembers={pendingMembers}
            totalCount={totalCount}
            onRoleChange={handleRoleChange}
            onDeleteClick={openDeleteMember}
            isFetchingNextPage={membersQuery.isFetchingNextPage}
            observerRef={observerRef}
            notificationReceiveByEmail={notificationReceiveByEmail}
            isNotificationLoading={
              notificationMembersQuery.isLoading ||
              notificationMembersQuery.isFetchingNextPage
            }
            isNotificationError={notificationMembersQuery.isError}
            onReceiveToggle={handleReceiveToggle}
            updatingMemberId={updatingMemberId}
          />

          <PermissionTable />

          <DeleteMemberModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteMember}
            member={selectedDeleteMember}
            onConfirm={handleDeleteMember}
            isLoading={deleteMemberMutation.isPending}
          />
        </div>
      </ErrorBoundary>
    </section>
  );
}
