import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCoreMutation, useCoreQuery } from "@/hooks/customQuery";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";
import TextareaField from "@/components/common/textarea/TextareaField";
import TransferOwnerModal from "@/components/workspace/TransferOwnerModal";
import WorkspaceSettingLoading from "@/components/workspace/WorkspaceSettingLoading";

import { getMyInfo } from "@/api/auth/auth";
import {
  changeWorkspaceOwner,
  deleteWorkspace,
  getAllWorkspaceMembers,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
} from "@/api/workspace/org";
import BuildingIcon from "@/assets/icon/common/building.svg?react";
import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";
import { getImageUrl } from "@/lib/getImageUrl";
import { QUERY_KEYS } from "@/lib/queryKeys";

export default function WorkspaceSetting() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const { data: workspaces } = useCoreQuery(
    QUERY_KEYS.workspace.list(),
    getMyWorkspaces,
  );
  const isAdmin = useMemo(() => {
    if (!workspaceId || !workspaces) return false;
    const workspace = workspaces.find((w) => w.orgId === Number(workspaceId));
    return workspace?.myRole === "ADMIN";
  }, [workspaceId, workspaces]);

  const orgId = useMemo(() => {
    if (!workspaceId) return null;
    const n = Number(workspaceId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [workspaceId]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteNameSnapshot, setDeleteNameSnapshot] = useState("");
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);

  const [serverLogoUrl, setServerLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    data: detail,
    isLoading: loading,
    isError,
    error,
    refetch: refetchDetail,
  } = useCoreQuery(
    QUERY_KEYS.workspace.detail(orgId ?? 0),
    () => getWorkspace(orgId!),
    { enabled: orgId !== null },
  );
  const errorMsg = isError ? (error.message ?? "불러오기 실패") : null;

  const membersQuery = useCoreQuery(
    QUERY_KEYS.workspace.members(orgId ?? 0),
    () => getAllWorkspaceMembers(orgId!),
    { enabled: orgId !== null },
  );

  // getMyInfo는 ICommonResponse를 그대로 반환 → userId는 data 안에 있음
  const { data: myInfoResponse } = useCoreQuery(
    QUERY_KEYS.auth.myInfo(),
    getMyInfo,
  );
  const myUserId = myInfoResponse?.data?.userId;
  const myName = myInfoResponse?.data?.name;

  const members = membersQuery.data?.members ?? [];
  const creatorId = membersQuery.data?.creatorId ?? null;

  const amICreator =
    creatorId !== null && myUserId !== undefined
      ? myUserId === creatorId
      : false;

  const currentOwner = useMemo(
    () =>
      creatorId !== null
        ? (members.find((m) => m.memberId === creatorId) ?? null)
        : null,
    [members, creatorId],
  );

  const adminCandidates = useMemo(
    () =>
      members.filter(
        (m) =>
          m.role === "ADMIN" &&
          (creatorId === null || m.memberId !== creatorId) &&
          (myUserId === undefined || m.memberId !== myUserId),
      ),
    [members, creatorId, myUserId],
  );

  useEffect(() => {
    if (!detail) return;
    setName(detail.name);
    setDesc(detail.description ?? "");
    setServerLogoUrl(detail.logoUrl ?? null);
    setLogoFile(null);
    setIsImageDeleted(false);
    setImageError(false);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [detail]);

  const updateMutation = useCoreMutation(
    (id: number) =>
      updateWorkspace(id, {
        name: name.trim(),
        description: desc.trim(),
        imageFile: logoFile,
        isImageDeleted,
      }),
    {
      invalidateKeys: [
        QUERY_KEYS.workspace.list(),
        ...(orgId !== null ? [QUERY_KEYS.workspace.detail(orgId)] : []),
      ],
      userOnSuccess: () => toast.success("변경사항이 저장되었습니다"),
      userOnError: (err) =>
        toast.error(err.message ?? "변경사항 저장에 실패했습니다"),
    },
  );

  const saving = updateMutation.isPending;

  const hasChanges = useMemo(() => {
    if (!detail) return false;

    const nameChanged = name.trim() !== detail.name;
    const descChanged = desc.trim() !== (detail.description ?? "").trim();
    const logoChanged =
      logoFile !== null || (isImageDeleted && Boolean(detail.logoUrl));

    return nameChanged || descChanged || logoChanged;
  }, [detail, name, desc, logoFile, isImageDeleted]);

  const onSave = () => {
    if (orgId === null || !name.trim() || !hasChanges) return;
    updateMutation.mutate(orgId);
  };

  const deleteMutation = useCoreMutation((id: number) => deleteWorkspace(id), {
    invalidateKeys: [QUERY_KEYS.workspace.list()],
    userOnSuccess: () => {
      toast.success("워크스페이스가 삭제되었습니다");
      setDeleteOpen(false);
      navigate("/workspace", { replace: true });
    },
    userOnError: (err) =>
      toast.error(err.message ?? "워크스페이스 삭제에 실패했습니다"),
  });

  const deleting = deleteMutation.isPending;

  const changeOwnerMutation = useCoreMutation(
    (newOwnerUserId: number) =>
      changeWorkspaceOwner(orgId!, { newOwnerUserId }),
    {
      invalidateKeys:
        orgId !== null
          ? [
              QUERY_KEYS.workspace.list(),
              QUERY_KEYS.workspace.members(orgId),
              QUERY_KEYS.workspace.detail(orgId),
            ]
          : [QUERY_KEYS.workspace.list()],
      userOnSuccess: () => {
        toast.success("조직 소유권이 양도되었습니다");
        setTransferOpen(false);
      },
      userOnError: (err) =>
        toast.error(err.message ?? "소유권 양도에 실패했습니다"),
    },
  );

  const onDelete = () => {
    if (orgId === null) return;
    if (deleteConfirmInput.trim() !== deleteNameSnapshot) {
      toast.error("워크스페이스 이름이 일치하지 않습니다");
      return;
    }
    deleteMutation.mutate(orgId);
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
            onClick={() => {
              refetchDetail();
            }}
          >
            다시 시도
          </Button>
        </Card>
      )}
      {!loading && !errorMsg && (
        <ErrorBoundary
          FallbackComponent={AreaErrorFallback}
          resetKeys={[detail]}
        >
          <>
            <Card className="p-8 tablet:p-6">
              <h2 className="font-heading3 text-text-title">조직 기본 정보</h2>
              <div className="mt-6 flex flex-row gap-12 items-start tablet:flex-col tablet:gap-8">
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
                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={!isAdmin || saving || deleting}
                    aria-label="로고 이미지 업로드 또는 변경"
                    className="flex h-60 w-60 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-surface-400 bg-surface-200 outline-none transition-colors hover:bg-surface-300/70 focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 tablet:h-46 tablet:w-46"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt=""
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : resolvedLogoUrl ? (
                      <img
                        src={resolvedLogoUrl}
                        alt=""
                        className="h-full w-full object-cover rounded-lg"
                        onError={() => {
                          setImageError(true);
                        }}
                      />
                    ) : (
                      <BuildingIcon
                        aria-hidden="true"
                        className="h-11 w-11 text-text-placeholder"
                      />
                    )}
                  </button>
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button
                      variant="custom"
                      type="button"
                      className="h-7! rounded-3xl border border-surface-400 bg-surface-100 px-4 font-body2 text-text-auth-sub transition-colors duration-200 ease-in-out hover:bg-surface-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-100"
                      onClick={openFilePicker}
                      aria-label="로고 이미지 업로드 버튼"
                      disabled={!isAdmin || saving || deleting}
                    >
                      업로드
                    </Button>
                    <Button
                      variant="custom"
                      type="button"
                      className="h-7! rounded-3xl border border-surface-400 bg-surface-100 px-4 font-body2 text-text-auth-sub transition-colors duration-200 ease-in-out hover:bg-surface-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-100"
                      onClick={onResetLogo}
                      aria-label="로고 이미지 초기화 버튼"
                      disabled={!isAdmin || saving || deleting}
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
                    disabled={!isAdmin || saving || deleting}
                  />
                  <TextareaField
                    id="workspace-setting-desc"
                    label="워크스페이스 설명"
                    placeholder="워크스페이스에 대한 설명을 입력해주세요"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    minRows={4}
                    className="min-h-90"
                    disabled={!isAdmin || saving || deleting}
                  />
                </div>
              </div>
              {isAdmin && (
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
                    size="small"
                    variant="primary"
                    type="button"
                    onClick={onSave}
                    disabled={
                      !isAdmin ||
                      !name.trim() ||
                      saving ||
                      deleting ||
                      !hasChanges
                    }
                    aria-label="변경사항 저장하기"
                    className="w-auto tablet:w-full"
                  >
                    {saving ? "저장 중.." : "저장"}
                  </Button>
                </div>
              )}
            </Card>

            {amICreator && (
              <Card className="p-8">
                <div className="flex items-center justify-between gap-6 tablet:flex-col tablet:items-stretch">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-heading3 text-text-title">
                      조직 소유권 양도
                    </h2>
                    <p className="mt-2 font-body1 text-text-auth-sub">
                      현재 소유자: {currentOwner?.name ?? myName ?? "-"}
                    </p>
                    <p className="mt-1 font-body2 text-text-muted break-keep">
                      소유권은 같은 조직의 관리자(ADMIN)에게만 양도할 수
                      있습니다.
                    </p>
                    <p className="mt-1 font-body2 text-text-muted break-keep">
                      양도 후에야 멤버가 있는 조직의 소유자가 회원 탈퇴를 진행할
                      수 있습니다.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="big"
                    onClick={() => setTransferOpen(true)}
                    disabled={
                      adminCandidates.length === 0 ||
                      changeOwnerMutation.isPending
                    }
                    className="w-auto shrink-0 self-center tablet:w-full"
                  >
                    소유권 양도
                  </Button>
                </div>
              </Card>
            )}

            <Modal
              isOpen={deleteOpen}
              onClose={() => {
                if (!deleting) {
                  setDeleteOpen(false);
                  setDeleteNameSnapshot("");
                  setDeleteConfirmInput("");
                }
              }}
              title="워크스페이스를 삭제할게요"
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
                title="워크스페이스를 삭제할게요"
                description={
                  <>
                    <p className="break-keep">
                      삭제하면 연결된 모든 데이터가 사라지고, 다시 되돌릴 수
                      없어요.
                    </p>
                    <p className="mt-1 break-keep">
                      아래 워크스페이스 이름을 그대로 입력해 주세요.
                    </p>
                  </>
                }
                confirmMatchSubheading={false}
                confirmMatchText={deleteNameSnapshot}
                confirmInput={deleteConfirmInput}
                onConfirmInputChange={setDeleteConfirmInput}
                confirmMatchInputPlaceholder="워크스페이스 이름"
                buttonText="영구 삭제"
                onConfirm={() => {
                  void onDelete();
                }}
                isLoading={deleting}
                variant="danger"
              />
            </Modal>

            <TransferOwnerModal
              isOpen={transferOpen}
              onClose={() => {
                if (!changeOwnerMutation.isPending) setTransferOpen(false);
              }}
              currentOwnerName={currentOwner?.name ?? myName ?? "-"}
              candidates={adminCandidates}
              onConfirm={(newOwnerUserId) => {
                changeOwnerMutation.mutate(newOwnerUserId);
              }}
              isLoading={changeOwnerMutation.isPending}
            />
          </>
        </ErrorBoundary>
      )}
    </section>
  );
}
