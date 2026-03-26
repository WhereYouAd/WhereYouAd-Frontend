import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Button from "@/components/common/button/Button";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import PageHeader from "@/components/common/PageHeader";
import TextareaField from "@/components/common/textarea/TextareaField";

import {
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
  uploadImage,
} from "@/api/workspace/org";
import BuildingIcon from "@/assets/icon/common/building.svg?react";
import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";
import { getAxiosMessage } from "@/lib/getAxiosMessage";
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

  const [serverLogoUrl, setServerLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
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
      setLogoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (e) {
      const message = getAxiosMessage(
        e,
        "워크스페이스 정보를 불러오지 못했습니다",
      );
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
      let nextLogoUrl = serverLogoUrl ?? null;

      if (logoFile) {
        setUploading(true);
        nextLogoUrl = await uploadImage(logoFile);
        setUploading(false);
      }
      await updateWorkspace(orgId, {
        name: nextName,
        description: nextDesc,
        logoUrl: nextLogoUrl,
      });
      toast.success("변경사항이 저장되었습니다");
      await fetchWorkspaceDetail();
    } catch (e) {
      toast.error(getAxiosMessage(e, "변경사항 저장에 실패했습니다"));
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };
  const onDelete = async () => {
    if (orgId === null) {
      setErrorMsg("잘못된 워크스페이스ID 입니다");
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
      toast.error(getAxiosMessage(e, "워크스페이스 삭제에 실패했습니다"));
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = () => {
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
          title="워크스페이스 관리"
          description="워크스페이스 정보를 확인하고 관리하세요."
        />
      </div>

      {loading && (
        <div className="bg-white p-10 text-center border border-gray-100 rounded-component-lg">
          <p className="font-body2 text-text-sub">불러오는중..</p>
        </div>
      )}
      {!loading && errorMsg && (
        <div className="bg-white p-10 text-center border border-gray-100 rounded-component-lg space-y-4">
          <p className="font-body2 text-status-red">{errorMsg}</p>
          <Button
            type="button"
            variant="primary"
            onClick={fetchWorkspaceDetail}
          >
            다시 시도
          </Button>
        </div>
      )}
      {!loading && !errorMsg && (
        <>
          <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
            <h2 className="font-heading4 text-text-main">기본 정보</h2>
            <p className="font-body2 text-text-sub mt-2">
              워크스페이스의 대표적인 정보를 설정합니다.
            </p>
            <div className="mt-9 flex flex-row gap-12 items-start tablet:flex-col tablet:gap-8">
              <div className="flex flex-col items-center w-60 tablet:w-full shrink-0">
                <div className="w-full text-text-main mb-3 ml-1 select-none tablet:text-center">
                  로고 이미지
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={onPickLogo}
                />
                <div className="flex h-60 w-60 items-center justify-center overflow-hidden rounded-component-sm border border-gray-100 bg-gray-100 tablet:h-46 tablet:w-46">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={"새 로고 미리보기"}
                      className="w-full h-full object-cover rounded-component-sm"
                    />
                  ) : resolvedLogoUrl ? (
                    <img
                      src={resolvedLogoUrl}
                      alt={`${name || "워크스페이스"} 로고`}
                      className="w-full h-full object-cover rounded-component-sm"
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
                    className="h-7! border border-gray-200 text-text-auth-sub px-4 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    onClick={openFilePicker}
                    aria-label="로고 이미지 업로드 버튼"
                    disabled={saving || deleting || uploading}
                  >
                    업로드
                  </Button>
                  <Button
                    variant="custom"
                    type="button"
                    className="h-7! border border-gray-200 text-text-auth-sub px-4 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    onClick={onResetLogo}
                    aria-label="로고 이미지 초기화 버튼"
                    disabled={saving || deleting || uploading}
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
                  disabled={saving || deleting || uploading}
                />
                <TextareaField
                  id="workspace-setting-desc"
                  label="워크스페이스 설명"
                  placeholder="워크스페이스에 대한 설명을 입력해주세요"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  minRows={4}
                  className="min-h-90"
                  disabled={saving || deleting || uploading}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-4 tablet:flex-col">
              <Button
                size="big"
                variant="secondary"
                type="button"
                onClick={() => {
                  if (!orgId) return;
                  void navigate(`/workspace/${orgId}/members`);
                }}
                aria-label="멤버 관리로 이동하기"
                className="w-auto tablet:w-full"
              >
                멤버 관리로 이동
              </Button>
              <Button
                size="big"
                variant="primary"
                type="button"
                onClick={onSave}
                disabled={!name.trim() || saving || deleting || uploading}
                aria-label="변경사항 저장하기"
                className="w-auto tablet:w-full"
              >
                {saving ? "저장 중.." : "변경사항 저장하기"}
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <ControlBox
              title="워크스페이스 삭제"
              description={`워크스페이스를 삭제하면 모든 데이터가 영구적으로 삭제됩니다.\n 이 작업은 되돌릴 수 없습니다`}
              buttonText="워크스페이스 삭제"
              onButtonClick={openDeleteModal}
              className="w-full"
              containerClassName="bg-status-red/10 border-status-red"
              titleClassName="text-status-red"
              descriptionClassName="text-text-auth-sub"
              buttonVariant="dangerSoft"
              buttonSize="big"
              buttonClassName="px-8 !rounded-component-md"
              buttonDisabled={saving || deleting || uploading}
              leadingSlot={<WarnIcon className="text-red-500 w-12 h-12" />}
            />
          </div>
          <Modal
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            size="lg"
            padding="lg"
            title="워크스페이스 삭제 확인"
          >
            <div className="text-center px-2 py-6">
              <div className="flex justify-center mb-6">
                <WarnIcon
                  className="text-status-red w-15 h-15"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-heading2 text-text-main mb-3">
                정말 삭제하시겠습니까?
              </h3>
              <p className="font-body1 text-text-auth-sub mb-7">
                삭제된 워크스페이스와 관련된 모든 데이터는 영구 삭제되며 <br />{" "}
                절대 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-center">
                <Button
                  variant="danger"
                  size="big"
                  aria-label="워크스페이스 최종 삭제 버튼"
                  onClick={onDelete}
                  className="w-auto tablet:w-full"
                  type="button"
                  disabled={deleting}
                >
                  {deleting ? "삭제 중.." : "삭제하기"}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </section>
  );
}
