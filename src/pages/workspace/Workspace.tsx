import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { TWorkspace } from "@/types/workspace/workspace";

import Button from "@/components/common/button/Button";
import {
  DropdownMenu,
  type TMenuItem,
} from "@/components/common/dropdownmenu/DropdownMenu";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

import PlusIcon from "@/assets/icon/workspace/plus.svg?react";
import SearchIcon from "@/assets/icon/workspace/search.svg?react";
import UpLoadImgIcon from "@/assets/icon/workspace/uploadImg.svg?react";
import VectorIcon from "@/assets/icon/workspace/Vector.svg?react";

export default function WorkspacePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const workspaces: TWorkspace[] = useMemo(
    () => [
      {
        id: "1",
        name: "광고회사1",
        description: "광고회사1입니다.",
        myRole: "admin",
      },
      {
        id: "2",
        name: "광고회사2",
        description: "광고회사2입니다.",
        myRole: "admin",
      },
      {
        id: "3",
        name: "광고회사3",
        description: "광고회사3입니다.",
        myRole: "admin",
      },
    ],
    [],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter((w) => w.name.toLowerCase().includes(q));
  }, [query, workspaces]);

  const menuItems = (id: TWorkspace["id"]): TMenuItem[] => [
    {
      label: "정보 수정하기",
      onClick: () => {
        void navigate(`/workspace/${id}/settings`);
      },
    },
    {
      label: "멤버 관리",
      onClick: () => alert("멤버 관리 기능은 추후 연결 예정"),
    },
  ];
  const onOpenCreate = () => {
    setNewName("");
    setNewDesc("");
    setCreateOpen(true);
  };

  // TODO: API 연동 후에 생성 동작 연결하기
  const onSubmitCreate = () => {
    alert("API 연동 후에 생성 기능 연결예정");
  };

  return (
    <section className="py-8 px-20">
      <header className="mb-7">
        <h1 className="font-heading2 text-text-main">워크 스페이스 관리</h1>
        <p className="font-body1 text-text-sub">
          워크스페이스 정보를 확인하고 관리하세요.
        </p>
      </header>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="조직을 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rightElement={<SearchIcon className="w-6 h-6 fill-chart-3" />}
          />
        </div>
        <Button
          onClick={onOpenCreate}
          size="big"
          variant="primary"
          className="bg-chart-3 flex shrink-0 whitespace-nowrap items-center justify-center gap-2 sm:w-auto w-full"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          워크스페이스 생성하기
        </Button>
      </div>
      <div className="space-y-5">
        {filtered.map((w) => (
          <div
            key={String(w.id)}
            className="flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-20 h-20 bg-gray-200 shrink-0 rounded-component-sm">
                {/* TODO: 스타일 확인을 위해 bg-gray-200넣어둠. API연동할때 삭제예정 */}
                {w.logoUrl}
              </div>
              <div className="min-w-0">
                <div className="font-heading3 text-text-main truncate">
                  {w.name}
                </div>
                <div className="font-body1 text-text-main mt-1 truncate">
                  {w.description ?? ""}
                </div>
                <div className="font-body1 text-text-sub mt-2">
                  {w.myRole ?? "내 직책 및 역할"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <DropdownMenu
                trigger={
                  <button
                    type="button"
                    aria-label="워크스페이스 메뉴"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <VectorIcon />
                  </button>
                }
                items={menuItems(w.id)}
              />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-component-lg bg-white p-10 text-center border border-gray-100">
            <p className="font-body2 text-text-sub">워크스페이스가 없습니다.</p>
          </div>
        )}
      </div>
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        size="xl"
        padding="lg"
        title="워크스페이스 생성"
      >
        <div className="px-2">
          <h2 className="font-heading3 text-text-main mb-2">
            워크스페이스 생성
          </h2>
          <p className="font-body1 text-text-sub mb-6">
            워크스페이스를 생성한 사용자는 자동으로 관리자 권한을 갖습니다.{" "}
            <br /> 로고 이미지와 기본 정보를 입력해 주세요.
          </p>
          <div className="space-y-6 mx-auto w-full max-w-[800px]">
            <div className="max-w-[560px] mx-auto w-full mb-10">
              <div className="flex items-center justify-between mb-2">
                <div className="font-label text-text-sub">로고 이미지</div>
                <Button
                  variant="custom"
                  className="!h-7 border border-gray-200 text-text-auth-sub px-5 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                  onClick={() => alert("TODO:추후 업로드")}
                >
                  업로드
                </Button>
              </div>
              <div className="rounded-component-lg border border-gray-100 bg-gray-50 h-[260px] flex items-center justify-center">
                <span className="text-text-sub">
                  <UpLoadImgIcon />
                </span>
              </div>
            </div>

            <Input
              label="워크스페이스 이름"
              placeholder="조직의 이름을 입력하세요."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex flex-col">
              <label
                className="text-text-main select-none ml-1"
                htmlFor="workspace-desc"
              >
                워크스페이스 설명
              </label>
              <textarea
                id="workspace-desc"
                className="w-full min-h-[120px] rounded-component-md bg-gray-50 px-5 py-4 outline-none transition-smooth hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-logo-1/30 text-body1 text-text-main placeholder:text-text-placeholder"
                placeholder="조직에 대한 간단한 설명을 입력하세요."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <Button
              size="big"
              variant="primary"
              onClick={onSubmitCreate}
              disabled={!newName.trim()}
              className="mx-auto px-10 mt-10"
            >
              생성하기
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
