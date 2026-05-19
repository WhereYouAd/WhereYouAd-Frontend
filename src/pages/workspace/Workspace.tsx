import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { IApiErrorResponse } from "@/types/common/common";
import type { TWorkspace } from "@/types/workspace/workspace";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import TextareaField from "@/components/common/textarea/TextareaField";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/WorkspaceEmptyState";
import WorkspaceListError from "@/components/workspace/WorkspaceListError";
import WorkspaceListLoading from "@/components/workspace/WorkspaceListLoading";

import { createWorkspace, getMyWorkspaces } from "@/api/workspace/org";
import PlusIcon from "@/assets/icon/common/plus.svg?react";
import SearchIcon from "@/assets/icon/common/search.svg?react";
import UpLoadImgIcon from "@/assets/icon/common/uploadImg.svg?react";
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
  const workspacesQuery = useQuery<TWorkspace[], IApiErrorResponse>({
    queryKey: ["my-workspaces"],
    queryFn: getMyWorkspaces,
  });

  const createWorkspaceMutation = useMutation<unknown, IApiErrorResponse>({
    mutationFn: async () => {
      const name = newName.trim();
      const description = newDesc.trim();
      return createWorkspace({ name, description, imageFile: logoFile });
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
      setCreateOpen(false);
    },
  });
  const isListLoading = workspacesQuery.isLoading;
  const listErrorMsg = workspacesQuery.isError
    ? workspacesQuery.error.message
    : null;

  const isCreating = createWorkspaceMutation.isPending;
  const createErrorMsg = createWorkspaceMutation.isError
    ? createWorkspaceMutation.error.message
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
      <div className="flex items-center justify-between gap-4 tablet:flex-col tablet:items-stretch">
        <div className="flex-1 tablet:w-full">
          <Input
            aria-label="조직 검색"
            placeholder="워크스페이스 검색하기"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rightElement={<SearchIcon className="h-6 w-6 fill-primary-500" />}
          />
        </div>
        <Button
          type="button"
          onClick={onOpenCreate}
          size="big"
          variant="primary"
          className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap tablet:w-full tablet:justify-center"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          <span className="tablet:hidden">워크스페이스 생성하기</span>
          <span className="hidden tablet:inline">생성하기</span>
        </Button>
      </div>

      {renderWorkspaceContent()}

      <Modal isOpen={createOpen} onClose={onCloseCreate} size="md" padding="lg">
        <div className="flex flex-col items-start px-2 tablet:px-0">
          <h2 className="mb-2 font-heading3 text-text-title">
            워크스페이스 생성
          </h2>
          <p className="mb-10 text-start font-body2 text-text-muted">
            워크스페이스를 생성한 사용자는 자동으로 관리자 권한을 갖습니다.
            <br className="tablet:hidden" />
            로고 이미지와 기본 정보를 입력해 주세요.
          </p>

          <div className="flex flex-col items-center w-full gap-8">
            <div className="flex flex-col items-center">
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
                className={`group relative flex h-40 w-40 flex-col items-center justify-center overflow-hidden rounded-3xl border-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none ${
                  logoPreview
                    ? "border-transparent shadow-Soft"
                    : "border-dashed border-surface-400 bg-surface-200 hover:border-primary-400 hover:bg-primary-100/50"
                }`}
              >
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="새 로고 미리 보기"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-text-400/40 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <UpLoadImgIcon className="mb-1 h-6 w-6 text-surface-100 transition-transform duration-300" />
                      <span className="font-caption text-surface-100">
                        사진 변경
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center transform transition-all duration-300">
                    <UpLoadImgIcon className="h-8 w-8 text-text-placeholder transition-colors duration-300 group-hover:text-primary-500" />
                    <span className="mt-2 font-caption text-text-placeholder transition-colors duration-300 group-hover:text-primary-500">
                      이미지 업로드
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* 입력 폼 */}
            <div className="w-full space-y-7">
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
                placeholder="워크스페이스에 대한 간단한 설명을 입력하세요."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                disabled={isCreating}
              />
              {createErrorMsg && (
                <p className="font-body2 text-info-red">{createErrorMsg}</p>
              )}
            </div>

            <div className="w-full mt-8">
              <Button
                size="big"
                variant="primary"
                onClick={onSubmitCreate}
                disabled={!newName.trim() || isCreating}
                fullWidth
                type="button"
              >
                {isCreating ? "생성 중.." : "생성하기"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
