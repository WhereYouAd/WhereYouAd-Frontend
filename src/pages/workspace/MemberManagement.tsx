import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import {
  type TMemberRole,
  type TUpdateMemberRoleRequest,
  type TWorkspaceMember,
} from "@/types/workspace/workspace";

import PageHeader from "@/components/common/PageHeader";
import DeleteMemberModal from "@/components/workspace/DeleteMemberModal";
import MemberList from "@/components/workspace/MemberList";
import PermissionTable from "@/components/workspace/PermissionTable";

import {
  deleteWorkspaceMember,
  getWorkspaceMemberCount,
  getWorkspaceMembers,
  updateWorkspaceMemberPermission,
} from "@/api/workspace/org";

const PAGE_SIZE = 20;

export default function MemberManagement() {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const orgId = Number(workspaceId);
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteMember, setSelectedDeleteMember] =
    useState<TWorkspaceMember | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const memberCountQuery = useQuery({
    queryKey: ["workspaceMemberCount", orgId],
    queryFn: () => getWorkspaceMemberCount(orgId),
    enabled: Number.isFinite(orgId) && orgId > 0,
  });
  const membersQuery = useInfiniteQuery({
    queryKey: ["workspaceMembers", orgId, PAGE_SIZE],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getWorkspaceMembers(orgId, pageParam, PAGE_SIZE),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
    enabled: Number.isFinite(orgId) && orgId > 0,
  });

  const members = useMemo(() => {
    return membersQuery.data?.pages.flatMap((page) => page.members) ?? [];
  }, [membersQuery.data]);

  const totalCount = memberCountQuery?.data?.totalCount ?? 0;

  const adminCount = useMemo(() => {
    return members.filter((member) => member.role === "ADMIN").length;
  }, [members]);

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      body,
    }: {
      memberId: number;
      body: TUpdateMemberRoleRequest;
    }) => updateWorkspaceMemberPermission(orgId, memberId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaceMembers", orgId],
      });
    },
    onError: (error) => {
      toast.error((error as unknown as IApiErrorResponse).message);
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: number) => deleteWorkspaceMember(orgId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaceMembers", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["workspaceMemberCount", orgId],
      });
    },
    onError: (error) => {
      toast.error((error as unknown as IApiErrorResponse).message);
    },
  });

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;
    if (!membersQuery.hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (
          firstEntry?.isIntersecting &&
          membersQuery.hasNextPage &&
          !membersQuery.isFetchingNextPage
        ) {
          void membersQuery.fetchNextPage();
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

  if (!Number.isFinite(orgId) || orgId <= 0) {
    return (
      <section className="w-full min-w-0">
        <header className="mb-7">
          <h1 className="font-heading2">멤버 관리</h1>
          <p className="font-body1 text-status-red">
            올바르지 않은 워크스페이스입니다.
          </p>
        </header>
      </section>
    );
  }

  if (memberCountQuery.isLoading || membersQuery.isLoading) {
    return (
      <section className="w-full min-w-0">
        <header className="mb-7">
          <h1 className="font-heading2">멤버 관리</h1>
          <p className="font-body1 text-text-sub">
            팀 구성원 정보를 불러오는 중입니다...
          </p>
        </header>
      </section>
    );
  }

  if (memberCountQuery.isError || membersQuery.isError) {
    const errorMessage =
      (memberCountQuery.error as unknown as IApiErrorResponse)?.message ||
      (membersQuery.error as unknown as IApiErrorResponse)?.message ||
      "팀 구성원 정보를 불러오지 못했습니다";

    return (
      <section className="w-full min-w-0">
        <header className="mb-7">
          <h1 className="font-heading2">멤버 관리</h1>
          <p className="font-body1 text-status-red">{errorMessage}</p>
        </header>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            void navigate(-1);
          }}
          className="inline-flex w-fit items-center gap-1 text-text-sub transition-colors hover:text-text-main"
        >
          <span aria-hidden="true">←</span>
          <span className="font-body2">뒤로 이동</span>
        </button>
        <PageHeader
          title="멤버 관리"
          description="팀 멤버를 효율적으로 관리하세요"
        />
      </div>

      <div className="flex w-full min-w-0 flex-col gap-10">
        <MemberList
          orgId={orgId}
          members={members}
          totalCount={totalCount}
          onRoleChange={handleRoleChange}
          onDeleteClick={openDeleteMember}
          isFetchingNextPage={membersQuery.isFetchingNextPage}
          observerRef={observerRef}
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
    </section>
  );
}
