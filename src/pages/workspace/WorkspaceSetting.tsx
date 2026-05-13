import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";
import TextareaField from "@/components/common/textarea/TextareaField";
import WorkspaceSettingLoading from "@/components/workspace/WorkspaceSettingLoading";

import {
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "@/api/workspace/org";
import BuildingIcon from "@/assets/icon/common/building.svg?react";
import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";
import { getImageUrl } from "@/lib/getImageUrl";

export default function WorkspaceSetting() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const queryClient = useQueryClient();

  const orgId = useMemo(() => {
    if (!workspaceId) return null;
    const n = Number(workspaceId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [workspaceId]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteNameSnapshot, setDeleteNameSnapshot] = useState("");
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  const [serverLogoUrl, setServerLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const fetchWorkspaceDetail = async () => {
    if (orgId === null) {
      setErrorMsg("잘못된 워크스페이스ID 입니다");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setImageError(false);
    try {
      const detail = await getWorkspace(orgId);
      setName(detail.name);
      setDesc(detail.description ?? "");
      setServerLogoUrl(detail.logoUrl ?? null);
      setLogoFile(null);
      setIsImageDeleted(false);
      setLogoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (e) {
      const message = (e as IApiErrorResponse).message;
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void fetchWorkspaceDetail();
  }, [orgId]);

  const onSave = async () => {
    if (orgId === null) {
      setErrorMsg("잘못된 워크스페이스ID 입니다");
      return;
    }
    const nextName = name.trim();
    const nextDesc = desc.trim();
    if (!nextName) return;
    setSaving(true);

    try {
      await updateWorkspace(orgId, {
        name: nextName,
        description: nextDesc,
        imageFile: logoFile,
        isImageDeleted,
      });
      await queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
      toast.success("변경사항이 저장되었습니다");
      await fetchWorkspaceDetail();
    } catch (e) {
      toast.error(
        (e as IApiErrorResponse).message ?? "변경사항 저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };
  const onDelete = async () => {
    if (orgId === null) {
      setErrorMsg("잘못된 워크스페이스ID 입니다");
      return;
    }
    if (deleteConfirmInput.trim() !== deleteNameSnapshot) {
      toast.error("워크스페이스 이름이 일치하지 않습니다.");
      return;
    }
    setDeleting(true);
    try {
      await deleteWorkspace(orgId);
      await queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
      toast.success("워크스페이스가 삭제되었습니다");
      setDeleteOpen(false);
      navigate("/workspace", { replace: true });
    } catch (e) {
      toast.error(
        (e as IApiErrorResponse).message ?? "워크스페이스 삭제에 실패했습니다.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = () => {
    const snapshot = name.trim();
    if (!snapshot) {
      toast.error("워크스페이스 이름을 먼저 입력해 주세요.");
      return;
    }
    setDeleteNameSnapshot(snapshot);
    setDeleteConfirmInput("");
    setDeleteOpen(true);
  };

  const openFilePicker = () => {
    if (!fileRef.current) return;
    fileRef.current.value = "";
    fileRef.current.click();
  };

  const onPickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setIsImageDeleted(false);

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

  const onResetLogo = () => {
    setLogoFile(null);
    setIsImageDeleted(true);
    setImageError(false);

    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setServerLogoUrl(null);
  };

  const resolvedLogoUrl =
    !logoPreview && !imageError && serverLogoUrl
      ? getImageUrl(serverLogoUrl)
      : null;

  return (
    <section className="w-full flex flex-col gap-8">
      {loading && <WorkspaceSettingLoading />}
      {!loading && errorMsg && (
        <Card className="space-y-4 p-10 text-center">
          <p className="font-body2 text-info-red">{errorMsg}</p>
          <Button
            type="button"
            variant="primary"
            onClick={fetchWorkspaceDetail}
          >
            다시 시도
          </Button>
        </Card>
      )}
      {!loading && !errorMsg && (
        <>
          <Card className="p-8">
            <div className="mt-9 flex flex-row gap-12 items-start tablet:flex-col tablet:gap-8">
              <div className="flex w-60 shrink-0 flex-col items-center tablet:w-full">
                <div className="mb-3 ml-1 w-full select-none font-body1 text-text-title tablet:text-center">
                  로고 이미지
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={onPickLogo}
                />
                <div className="flex h-60 w-60 items-center justify-center overflow-hidden rounded-lg border border-surface-400 bg-surface-200 tablet:h-46 tablet:w-46">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={"새 로고 미리보기"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : resolvedLogoUrl ? (
                    <img
                      src={resolvedLogoUrl}
                      alt={`${name || "워크스페이스"} 로고`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <BuildingIcon
                      aria-hidden="true"
                      className="w-11 h-11 text-text-placeholder"
                    />
                  )}
                </div>
                <div className="flex gap-2 mt-4 justify-center">
                  <Button
                    variant="custom"
                    type="button"
                    className="h-7! rounded-3xl border border-surface-400 bg-surface-100 px-4 font-body2 text-text-auth-sub transition-colors duration-200 ease-in-out hover:bg-surface-200"
                    onClick={openFilePicker}
                    aria-label="로고 이미지 업로드 버튼"
                    disabled={saving || deleting}
                  >
                    업로드
                  </Button>
                  <Button
                    variant="custom"
                    type="button"
                    className="h-7! rounded-3xl border border-surface-400 bg-surface-100 px-4 font-body2 text-text-auth-sub transition-colors duration-200 ease-in-out hover:bg-surface-200"
                    onClick={onResetLogo}
                    aria-label="로고 이미지 초기화 버튼"
                    disabled={saving || deleting}
                  >
                    초기화
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <Input
                  label="워크스페이스명"
                  value={name}
                  placeholder="조직의 이름 또는 워크스페이스 이름을 입력해주세요"
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving || deleting}
                />
                <TextareaField
                  id="workspace-setting-desc"
                  label="워크스페이스 설명"
                  placeholder="워크스페이스에 대한 설명을 입력해주세요"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  minRows={4}
                  className="min-h-90"
                  disabled={saving || deleting}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 tablet:flex-col tablet:items-stretch">
              <Button
                type="button"
                variant="dangerSoft"
                size="big"
                onClick={openDeleteModal}
                disabled={saving || deleting}
                className="w-auto tablet:w-full"
              >
                워크스페이스 삭제
              </Button>
              <Button
                size="big"
                variant="primary"
                type="button"
                onClick={onSave}
                disabled={!name.trim() || saving || deleting}
                aria-label="변경사항 저장하기"
                className="w-auto tablet:w-full"
              >
                {saving ? "저장 중.." : "변경사항 저장하기"}
              </Button>
            </div>
          </Card>

          <Modal
            isOpen={deleteOpen}
            onClose={() => {
              if (!deleting) {
                setDeleteOpen(false);
                setDeleteNameSnapshot("");
                setDeleteConfirmInput("");
              }
            }}
            title="워크스페이스 삭제"
            size="lg"
            disableOverlayClick={deleting}
          >
            <ModalContent
              icon={
                <WarnIcon
                  className="h-7 w-7 text-info-red"
                  aria-hidden="true"
                />
              }
              title="정말 삭제하시겠습니까?"
              description={
                <>
                  워크스페이스를 삭제하면 연결된 모든 데이터가 영구적으로
                  삭제됩니다.
                  <br />
                  삭제 후에는 복구할 수 없습니다.
                </>
              }
              confirmMatchText={deleteNameSnapshot}
              confirmInput={deleteConfirmInput}
              onConfirmInputChange={setDeleteConfirmInput}
              buttonText="삭제하기"
              onConfirm={() => {
                void onDelete();
              }}
              isLoading={deleting}
              variant="danger"
            />
          </Modal>
        </>
      )}
    </section>
  );
}
