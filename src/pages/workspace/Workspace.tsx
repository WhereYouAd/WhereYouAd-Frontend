import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { TWorkspace } from "@/types/workspace/workspace";

import Button from "@/components/common/button/Button";
import { type TMenuItem } from "@/components/common/dropdownmenu/DropdownMenu";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import PageHeader from "@/components/common/PageHeader";
import TextareaField from "@/components/common/textarea/TextareaField";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/WorkspaceEmptyState";
import WorkspaceListError from "@/components/workspace/WorkspaceListError";
import WorkspaceListLoading from "@/components/workspace/WorkspaceListLoading";

import {
  createWorkspace,
  getMyWorkspaces,
  uploadImage,
} from "@/api/workspace/org";
import EditContainIcon from "@/assets/icon/common/edit.svg?react";
import PlusIcon from "@/assets/icon/common/plus.svg?react";
import SearchIcon from "@/assets/icon/common/search.svg?react";
import UpLoadImgIcon from "@/assets/icon/common/uploadImg.svg?react";
import UserProfileIcon from "@/assets/icon/common/userProfile.svg?react";
import { getAxiosMessage } from "@/lib/getAxiosMessage";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function WorkspacePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const workspacesQuery = useQuery({
    queryKey: ["my-workspaces"],
    queryFn: getMyWorkspaces,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async () => {
      const name = newName.trim();
      const description = newDesc.trim();
      let logoUrl: string | null = null;

      if (logoFile) {
        logoUrl = await uploadImage(logoFile);
      }
      return createWorkspace({ name, description, logoUrl });
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
      setCreateOpen(false);
    },
  });
  const isListLoading = workspacesQuery.isLoading;
  const listErrorMsg = workspacesQuery.isError
    ? getAxiosMessage(
        workspacesQuery.error,
        "워크스페이스 목록 조회중 오류가 발생했습니다",
      )
    : null;

  const isCreating = createWorkspaceMutation.isPending;
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

  const workspaces = workspacesQuery.data ?? [];
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter((w) => w.name.toLowerCase().includes(q));
  }, [query, workspaces]);

  const sortedWorkspaces = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.orgId === selectedOrgId) return -1;
      if (b.orgId === selectedOrgId) return 1;
      return 0;
    });
  }, [filtered, selectedOrgId]);

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
      onClick: () => {
        void navigate(`/workspace/${id}/members`);
      },
    },
  ];

  const onCloseCreate = () => {
    setLogoPreview(null);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCreateOpen(false);
  };
  const onOpenCreate = () => {
    setNewName("");
    setNewDesc("");
    setLogoFile(null);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    createWorkspaceMutation.reset();
    setCreateOpen(true);
  };

  const onPickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return previewUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const onSubmitCreate = async () => {
    if (!newName.trim()) return;
    createWorkspaceMutation.mutate();
  };

  const renderWorkspaceContent = () => {
    if (isListLoading) {
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
    if (sortedWorkspaces.length === 0) {
      return (
        <ul className="space-y-5">
          <WorkspaceEmptyState message="워크스페이스가 없습니다" />
        </ul>
      );
    }
    return (
      <ul className="space-y-5">
        {sortedWorkspaces.map((w) => (
          <WorkspaceCard
            key={String(w.orgId)}
            workspace={w}
            menuItems={menuItems(w.orgId)}
            isSelected={w.orgId === selectedOrgId}
            onClick={() => {
              void navigate(`/workspace/${w.orgId}/settings`);
            }}
          />
        ))}
      </ul>
    );
  };

  return (
    <section className="w-full flex flex-col gap-8">
      <PageHeader
        title="워크스페이스 관리"
        description="워크스페이스 정보를 확인하고 관리하세요."
      />
      <div className="flex items-center justify-between gap-4 tablet:flex-col tablet:items-stretch">
        <div className="flex-1 tablet:w-full">
          <Input
            aria-label="조직 검색"
            placeholder="워크스페이스 검색하기"
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
          className="bg-chart-3 flex shrink-0 whitespace-nowrap items-center justify-center gap-2 tablet:w-full tablet:justify-center"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          <span className="tablet:hidden">워크스페이스 생성하기</span>
          <span className="hidden tablet:inline">생성하기</span>
        </Button>
      </div>

      {renderWorkspaceContent()}

      <Modal
        isOpen={createOpen}
        onClose={onCloseCreate}
        size="xl"
        padding="lg"
        className="tablet:w-150"
      >
        <div className="px-1 tablet:px-0">
          <h2 className="font-heading4 text-text-main mb-2">
            워크스페이스 생성
          </h2>
          <p className="font-body1 text-text-sub mb-5">
            워크스페이스를 생성한 사용자는 자동으로 관리자 권한을 갖습니다.{" "}
            <br /> 로고 이미지와 기본 정보를 입력해 주세요.
          </p>
          <div className="flex flex-row gap-8 items-start tablet:flex-col tablet:gap-5">
            <div className="flex flex-col items-center w-45 shrink-0 tablet:w-full">
              <div className="w-full mb-3 select-none text-text-main tablet:text-center">
                로고 이미지
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={onPickLogo}
              />
              <button
                type="button"
                aria-label="로고 이미지 업로드"
                onClick={openFile}
                className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-component-sm border border-gray-100 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="새 로고 미리 보기"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UpLoadImgIcon className="text-text-placeholder w-8 h-8 tablet:w-7 tablet:h-7" />
                )}
              </button>

              <Button
                variant="custom"
                className="h-7! mt-4 border border-gray-200 text-text-auth-sub px-4 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                onClick={openFile}
                type="button"
              >
                업로드
              </Button>
            </div>
            <div className="flex-1 w-full space-y-5">
              <Input
                label="워크스페이스 이름"
                placeholder="사용할 워크스페이스의 이름을 입력하세요."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isCreating}
              />
              <TextareaField
                id="workspace-desc"
                label="워크스페이스 설명"
                placeholder="워크스페이스에 대한 간단한 설명을 입력하세요"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                disabled={isCreating}
              />
              {createErrorMsg && (
                <p className="font-body2 text-status-red">{createErrorMsg}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-12 tablet:mt-6">
            <Button
              size="big"
              variant="primary"
              onClick={onSubmitCreate}
              disabled={!newName.trim() || isCreating}
              className="px-12 w-auto tablet:w-full"
              type="button"
            >
              {isCreating ? "생성 중.. " : "생성하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
