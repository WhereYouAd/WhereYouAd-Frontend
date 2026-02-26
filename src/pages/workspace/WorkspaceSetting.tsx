import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

import MessageCircleWarningIcon from "@/assets/icon/workspace/message-circle-warning.svg?react";
import UpLoadImgIcon from "@/assets/icon/workspace/uploadImg.svg?react";
import WarningIcon from "@/assets/icon/workspace/warning.svg?react";

export default function WorkspaceSetting() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const onSave = () => {
    alert(`API 연동후 저장예정 (workspaceId=${workspaceId})`);
  };
  const onDelete = () => {
    alert(`API 연동후 삭제예정 (workspaceId=${workspaceId})`);
    setDeleteOpen(false);
    navigate("/workspace", { replace: true });
  };

  return (
    <section className="w-full">
      <header className="mb-7">
        <h1 className="font-heading2 text-text-main">워크스페이스 관리</h1>
        <p className="font-body1 text-text-sub">
          워크스페이스 정보를 확인하고 관리하세요.
        </p>
      </header>
      <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
        <h2 className="font-heading4 text-text-main">기본 정보</h2>
        <p className="font-body2 text-text-sub mt-2">
          워크스페이스의 대표적인 정보를 설정합니다.
        </p>
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[minmax(320px,560px)_1fr] gap-8">
          <div>
            <div className="text-text-main">로고 이미지</div>
            <div className="border border-gray-100 bg-gray-50 rounded-component-lg flex items-center justify-center h-56 sm:h-72 lg:h-80">
              <UpLoadImgIcon />
            </div>
            <div className="flex gap-3 mt-3 justify-center">
              <Button
                variant="custom"
                className="!h-7 border border-gray-200 text-text-auth-sub px-5 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                onClick={() => alert("TODO:추후 업로드")}
                aria-label="로고 이미지 업로드 버튼"
              >
                업로드
              </Button>
              <Button
                variant="custom"
                className="!h-7 border border-gray-200 text-text-auth-sub px-5 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                onClick={() => alert("TODO:추후 초기화연결")}
                aria-label="로고 이미지 초기화 버튼"
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
            />
            <div className="flex flex-col">
              <label
                className="text-text-main select-none ml-1"
                htmlFor="workspace-setting-desc"
              >
                워크스페이스 설명
              </label>
              <textarea
                id="workspace-setting-desc"
                className="w-full min-h-55 rounded-component-md bg-gray-50 px-5 py-4 outline-none transition-smooth hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-logo-1/30 text-body1 text-text-main placeholder:text-text-placeholder"
                placeholder="워크스페이스에 대한 설명을 입력해주세요"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          size="big"
          variant="primary"
          onClick={onSave}
          disabled={!name.trim()}
          aria-label="변경사항 저장하기"
          className="w-full sm:w-auto"
        >
          변경사항 저장하기
        </Button>
      </div>
      <div className="bg-status-red/10 border border-status-red rounded-component-lg p-6 sm:p-8 mt-12 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
        <div className="flex gap-4 sm:gap-8 items-start sm:items-center">
          <WarningIcon />
          <div>
            <div className="text-status-red font-heading4">
              워크스페이스 삭제
            </div>
            <p className="font-body1 text-text-auth-sub mt-2">
              워크스페이스를 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        </div>
        <Button
          variant="dangerSoft"
          size="big"
          aria-label="워크스페이스 삭제 버튼"
          onClick={() => setDeleteOpen(true)}
        >
          워크스페이스 삭제
        </Button>
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
            삭제된 워크스페이스와 관련된 모든 데이터는 영구 삭제되며 <br /> 절대
            되돌릴 수 없습니다.
          </p>
          <div className="flex justify-center">
            <Button
              variant="danger"
              size="big"
              aria-label="워크스페이스 최종 삭제 버튼"
              onClick={onDelete}
              className="w-full md:w-auto"
            >
              삭제하기
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
