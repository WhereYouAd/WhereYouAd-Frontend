import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type TMemberRole,
  type TWorkspaceMember,
} from "@/types/workspace/workspace";

import ControlBox from "@/components/common/controlbox/ControlBox";
import DeleteMemberModal from "@/components/workspace/DeleteMemberModal";
import MemberList from "@/components/workspace/MemberList";
import PermissionTable from "@/components/workspace/PermissionTable";
import TransferOwnershipBlockedModal from "@/components/workspace/TransferOwnershipBlockedModal";
import TransferOwnershipModal from "@/components/workspace/TransferOwnershipModal";

import {
  getWorkspaceMemberCount,
  getWorkspaceMembers,
} from "@/api/workspace/org";
import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

const PAGE_SIZE = 20;

export default function MemberManagement() {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const orgId = Number(workspaceId);

  const [changing, setChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

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

  const transferableCandidates = useMemo(() => {
    return members.filter((member) => !member.isMe && member.role === "ADMIN");
  }, [members]);

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

  const handleRoleChange = (targetMemberId: number, newRole: TMemberRole) => {
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
      toast.error("마지막 관리자는 멤버로 변경할 수 없습니다");
      return;
    }
    // TODO:관리자 변경 API 연동
  };

  const openChangeModal = () => {
    if (transferableCandidates.length === 0) {
      setIsBlockedModalOpen(true);
      return;
    }
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    if (changing) return;
    setIsTransferModalOpen(false);
  };

  const handleTransferOwnership = async (member: TWorkspaceMember) => {
    setChanging(true);
    try {
      // TODO: 관리자 변경 API 연동
      toast.success(`${member.name}님으로 관리자가 변경되었습니다`);
      setIsTransferModalOpen(false);
      navigate("/workspace");
    } catch (error) {
      toast.error("관리자 변경에 실패했습니다. 다시 시도해주세요");
      console.error("관리자변경실패", error);
    } finally {
      setChanging(false);
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
    if (deleting) return;
    setIsDeleteModalOpen(false);
    setSelectedDeleteMember(null);
  };

  const handleDeleteMember = async (member: TWorkspaceMember) => {
    setDeleting(true);
    try {
      // TODO: 삭제 API 연동
      toast.success(`${member.name}님이 삭제되었습니다`);
      setIsDeleteModalOpen(false);
      setSelectedDeleteMember(null);
    } catch (error) {
      toast.error("팀원 삭제에 실패했습니다. 다시 시도해주세요");
      console.error("팀원 삭제 실패", error);
    } finally {
      setDeleting(false);
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
    return (
      <section className="w-full min-w-0">
        <header className="mb-7">
          <h1 className="font-heading2">멤버 관리</h1>
          <p className="font-body1 text-status-red">
            팀 구성원 정보를 불러오지 못했습니다
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0">
      <header className="mb-7">
        <h1 className="font-heading2">멤버 관리</h1>
        <p className="font-body1 text-text-sub">
          팀 구성원을 효율적으로 관리하세요
        </p>
      </header>

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
        <ControlBox
          title="관리자 변경"
          description="이 조직의 소유권을 다른 멤버에게 양도합니다. 이 작업은 되돌릴 수 없습니다."
          buttonText="소유권 이전"
          onButtonClick={openChangeModal}
          className="w-full min-w-0"
          containerClassName="border-status-red bg-status-red/10"
          titleClassName="text-status-red"
          descriptionClassName="text-text-auth-sub"
          buttonVariant="dangerSoft"
          buttonSize="big"
          buttonClassName="px-8 !rounded-component-md"
          leadingSlot={<WarnIcon className="h-12 w-12 text-red-500" />}
        />

        <TransferOwnershipModal
          isOpen={isTransferModalOpen}
          onClose={closeTransferModal}
          candidates={transferableCandidates}
          onConfirm={handleTransferOwnership}
          isLoading={changing}
        />

        <TransferOwnershipBlockedModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
        />

        <DeleteMemberModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteMember}
          member={selectedDeleteMember}
          onConfirm={handleDeleteMember}
          isLoading={deleting}
        />
      </div>
    </section>
  );
}
