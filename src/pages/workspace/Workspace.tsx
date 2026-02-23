import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { TWorkspace } from "@/types/workspace/workspace";

import Button from "@/components/common/button/Button";
import {
  DropdownMenu,
  type TMenuItem,
} from "@/components/common/dropdownmenu/DropdownMenu";
import Input from "@/components/common/input/Input";

import PlusIcon from "@/assets/icon/workspace/plus.svg?react";
import SearchIcon from "@/assets/icon/workspace/search.svg?react";
import VectorIcon from "@/assets/icon/workspace/Vector.svg?react";

export default function WorkspacePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  // const [createOpen, setCreateOpen] = useState(false);

  // const [newName, setNewName] = useState("");
  // const [newIntro, setNewIntro] = useState("");
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
  // const onOpenCreate = () => {
  //   setNewName("");
  //   setNewIntro("");
  //   setCreateOpen(true);
  // };

  //TODO: API 연동 후에 생성 동작 연결하기
  // const onSubmitCreate = () => {
  //   alert("API 연동 후에 생성 기능 연결예정");
  // };

  return (
    <section className="p-8">
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
          // onClick={onOpenCreate}
          size="big"
          variant="primary"
          className="bg-chart-3 flex shrink-0 whitespace sm:w-auto w-full"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          <span>워크스페이스 생성하기</span>
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
    </section>
  );
}
