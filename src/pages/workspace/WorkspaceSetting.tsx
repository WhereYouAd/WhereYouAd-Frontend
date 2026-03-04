import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Button from "@/components/common/button/Button";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import TextareaField from "@/components/common/textarea/TextareaField";

import {
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "@/api/workspace/org";
import MessageCircleWarningIcon from "@/assets/icon/workspace/message-circle-warning.svg?react";
import UpLoadImgIcon from "@/assets/icon/workspace/uploadImg.svg?react";
import WarningIcon from "@/assets/icon/workspace/warning.svg?react";
import { getAxiosMessage } from "@/lib/getAxiosMessage";

export default function WorkspaceSetting() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const orgId = useMemo(() => {
    if (workspaceId === null) return null;
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

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const fetchWorkspaceDetail = async () => {
    if (orgId === null) {
      setErrorMsg("잘못된 워크스페이스ID 입니다");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const detail = await getWorkspace(orgId);
      setName(detail.name);
      setDesc(detail.description ?? "");
      setLogoUrl(detail.logoUrl ?? null);
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
      await updateWorkspace(orgId, {
        name: nextName,
        description: nextDesc,
        logoUrl,
      });
      toast.success("변경사항이 저장되었습니다");
      await fetchWorkspaceDetail();
    } catch (e) {
      toast.error(getAxiosMessage(e, "변경사항 저장에 실패했습니다"));
    } finally {
      setSaving(false);
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

  return (
    <section className="w-full">
      <header className="mb-7">
        <h1 className="font-heading2 text-text-main">워크스페이스 관리</h1>
        <p className="font-body1 text-text-sub">
          워크스페이스 정보를 확인하고 관리하세요.
        </p>
      </header>

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
            <div className="mt-7 grid grid-cols-1 lg:grid-cols-[minmax(320px,560px)_1fr] gap-8">
              <div>
                <div className="text-text-main">로고 이미지</div>
                <div className="border border-gray-100 bg-gray-50 rounded-component-lg flex items-center justify-center h-56 sm:h-72 lg:h-80 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${name || "워크스페이스"} 로고`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UpLoadImgIcon aria-hidden="true" />
                  )}
                </div>
                <div className="flex gap-3 mt-3 justify-center">
                  <Button
                    variant="custom"
                    className="h-7! border border-gray-200 text-text-auth-sub px-5 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    onClick={() => alert("TODO:추후 업로드")}
                    aria-label="로고 이미지 업로드 버튼"
                    disabled={saving || deleting}
                  >
                    업로드
                  </Button>
                  <Button
                    variant="custom"
                    className="h-7! border border-gray-200 text-text-auth-sub px-5 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    onClick={() => setLogoUrl(null)}
                    aria-label="로고 이미지 초기화 버튼"
                    disabled={saving || deleting}
                  >
                    초기화
                  </Button>
                </div>
              </div>
              <div className="space-y-5">
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
                  className="min-h-55"
                  disabled={saving || deleting}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              size="big"
              variant="primary"
              onClick={onSave}
              disabled={!name.trim() || saving || deleting}
              aria-label="변경사항 저장하기"
              className="w-full sm:w-auto"
            >
              {saving ? "저장 중.." : "변경사항 저장하기"}
            </Button>
          </div>
          <div className="w-full flex flex-col">
            <ControlBox
              title="워크스페이스 삭제"
              description={`워크스페이스를 삭제하면 모든 데이터가 영구적으로 삭제됩니다.\n 이 작업은 되돌릴 수 없습니다`}
              buttonText="워크스페이스 삭제"
              onButtonClick={openDeleteModal}
              className="w-full mt-12"
              containerClassName="bg-status-red/10 border-status-red"
              titleClassName="text-status-red"
              descriptionClassName="text-text-auth-sub"
              buttonVariant="dangerSoft"
              buttonSize="big"
              buttonClassName="px-8 !rounded-component-md"
              buttonDisabled={saving || deleting}
              leadingSlot={<WarningIcon />}
            />
          </div>
          <Modal
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            size="lg"
            padding="lg"
            title="워크스페이스 삭제 확인"
          >
            <div className="text-center px-2 py-6 ">
              <div className="flex justify-center mb-6">
                <MessageCircleWarningIcon />
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
                  className="w-full md:w-auto"
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
