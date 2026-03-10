import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { TWorkspace } from "@/types/workspace/workspace";

import Button from "@/components/common/button/Button";
import { type TMenuItem } from "@/components/common/dropdownmenu/DropdownMenu";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import TextareaField from "@/components/common/textarea/TextareaField";
import WorkspaceListLoading from "@/components/workspace/WorkpspaceListLoading";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/WorkspaceEmptyState";
import WorkspaceListError from "@/components/workspace/WorkspaceListError";

import { createWorkspace, getMyWorkspaces } from "@/api/workspace/org";
import EditContainIcon from "@/assets/icon/workspace/edit-contained.svg?react";
import PlusIcon from "@/assets/icon/workspace/plus.svg?react";
import SearchIcon from "@/assets/icon/workspace/search.svg?react";
import UpLoadImgIcon from "@/assets/icon/workspace/uploadImg.svg?react";
import UserProfileIcon from "@/assets/icon/workspace/userProfile.svg?react";
import { getAxiosMessage } from "@/lib/getAxiosMessage";

export default function WorkspacePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const queryClient = useQueryClient();
  const workspacesQuery = useQuery({
    queryKey: ["my-workspaces"],
    queryFn: getMyWorkspaces,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
      setCreateOpen(false);
    },
  });
  const listLoading = workspacesQuery.isLoading || workspacesQuery.isFetching;
  const listErrorMsg = workspacesQuery.isError
    ? getAxiosMessage(
        workspacesQuery.error,
        "워크스페이스 목록 조회중 오류가 발생했습니다",
      )
    : null;

  const creating = createWorkspaceMutation.isPending;
  const createErrorMsg = createWorkspaceMutation.isError
    ? getAxiosMessage(
        createWorkspaceMutation.error,
        "워크스페이스 생성 중 오류가 발생했습니다",
      )
    : null;

  const fileRef = useRef<HTMLInputElement | null>(null);
  const openFile = () => {
    if (!fileRef.current) return;
    fileRef.current.value = "";
    fileRef.current.click();
  };

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const workspaces = workspacesQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter((w) => w.name.toLowerCase().includes(q));
  }, [query, workspaces]);

  const menuItems = (id: TWorkspace["orgId"]): TMenuItem[] => [
    {
      icon: <EditContainIcon className="h-5 w-5 fill-none stroke-current" />,
      label: "정보 수정하기",
      onClick: () => {
        void navigate(`/workspace/${id}/settings`);
      },
    },
    {
      icon: <UserProfileIcon className="h-5 w-5 fill-none stroke-current" />,
      label: "멤버 관리",
      onClick: () => alert("멤버 관리 기능은 추후 연결 예정"),
    },
  ];

  const onCloseCreate = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setCreateOpen(false);
  };
  const onOpenCreate = () => {
    setNewName("");
    setNewDesc("");
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    createWorkspaceMutation.reset();
    setCreateOpen(true);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const onSubmitCreate = () => {
    const name = newName.trim();
    const description = newDesc.trim();
    if (!name) return;
    createWorkspaceMutation.mutate({ name, description, logoUrl: null });
  };

  const renderWorkspaceContent = () => {
    if (listLoading) {
      return <WorkspaceListLoading />;
    }
    if (listErrorMsg) {
      return (
        <WorkspaceListError
          message={listErrorMsg}
          onRetry={() => workspacesQuery.refetch()}
        />
      );
    }
    if (filtered.length === 0) {
      return (
        <ul className="space-y-5">
          <WorkspaceEmptyState message="워크스페이스가 없습니다" />
        </ul>
      );
    }
    return (
      <ul className="space-y-5">
        {filtered.map((w) => (
          <WorkspaceCard
            key={String(w.orgId)}
            workspace={w}
            menuItems={menuItems(w.orgId)}
          />
        ))}
      </ul>
    );
  };

  return (
    <section className="w-full">
      <header className="mb-7">
        <h1 className="font-heading2 text-text-main">워크스페이스 관리</h1>
        <p className="font-body1 text-text-sub">
          워크스페이스 정보를 확인하고 관리하세요.
        </p>
      </header>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            aria-label="조직 검색"
            placeholder="조직을 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rightElement={<SearchIcon className="w-6 h-6 fill-chart-3" />}
          />
        </div>
        <Button
          type="button"
          onClick={onOpenCreate}
          size="big"
          variant="primary"
          className="bg-chart-3 flex w-full shrink-0 whitespace-nowrap items-center justify-center gap-2 sm:w-auto"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          워크스페이스 생성하기
        </Button>
      </div>

      {renderWorkspaceContent()}

      <Modal isOpen={createOpen} onClose={onCloseCreate} size="xl" padding="lg">
        <div className="px-2">
          <h2 className="font-heading4 text-text-main mb-2">
            워크스페이스 생성
          </h2>
          <p className="font-body1 text-text-sub mb-6">
            워크스페이스를 생성한 사용자는 자동으로 관리자 권한을 갖습니다.{" "}
            <br /> 로고 이미지와 기본 정보를 입력해 주세요.
          </p>
          <div className="space-y-6 mx-auto w-full max-w-200">
            <div className="max-w-140 mx-auto w-full mb-10">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
              />
              <div className="flex items-center justify-between mb-2">
                <div className="font-label text-text-sub">로고 이미지</div>
                <Button
                  variant="custom"
                  className="h-7! border border-gray-200 text-text-auth-sub px-5 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                  onClick={openFile}
                  type="button"
                >
                  업로드
                </Button>
              </div>
              <button
                type="button"
                aria-label="로고 이미지 업로드"
                onClick={openFile}
                className="w-full rounded-component-lg border border-gray-100 bg-gray-50 h-65 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="text-text-sub">
                  <UpLoadImgIcon />
                </span>
              </button>
            </div>

            <Input
              label="워크스페이스 이름"
              placeholder="조직의 이름을 입력하세요."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={creating}
            />
            <TextareaField
              id="workspace-desc"
              label="워크스페이스 설명"
              placeholder="조직에 대한 간단한 설명을 입력하세요"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              disabled={creating}
            />
            {createErrorMsg && (
              <p className="font-body2 text-status-red">{createErrorMsg}</p>
            )}
            <Button
              size="big"
              variant="primary"
              onClick={onSubmitCreate}
              disabled={!newName.trim() || creating}
              className="mx-auto px-10 mt-10"
              type="button"
            >
              {creating ? "생성 중.. " : "생성하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
