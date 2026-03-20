// 멤버 input + 드랍다운 컴포넌트 만들고나서 이거 재사용가능한 컴포넌트로
// 분리 방법생각하기

import { useEffect, useMemo, useRef, useState } from "react";

import type { TWorkspaceMember } from "@/types/workspace/workspace";

import Input from "../common/input/Input";

import SearchIcon from "@/assets/icon/common/search.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";

type TMemberSearchSelectProps = {
  candidates: TWorkspaceMember[];
  selectedMember: TWorkspaceMember | null;
  onSelect: (member: TWorkspaceMember) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
};

export default function MemberSearchSelect({
  candidates,
  selectedMember,
  onSelect,
  isOpen,
  onOpenChange,
  placeholder = "권한을 양도할 멤버를 검색하세요",
}: TMemberSearchSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState(selectedMember?.name ?? "");

  useEffect(() => {
    setKeyword(selectedMember?.name ?? "");
  }, [selectedMember]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onOpenChange]);

  const filteredCandidates = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    if (!trimmedKeyword) {
      return candidates;
    }
    return candidates.filter((candidate) => {
      return (
        candidate.name.toLowerCase().includes(trimmedKeyword) ||
        candidate.email.toLowerCase().includes(trimmedKeyword)
      );
    });
  }, [candidates, keyword]);

  const handleFocus = () => {
    onOpenChange(true);
  };

  const handleChangeKeyword = (value: string) => {
    setKeyword(value);
    onOpenChange(true);
  };

  const handleSelect = (member: TWorkspaceMember) => {
    onSelect(member);
    setKeyword(member.name);
    onOpenChange(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          value={keyword}
          onFocus={handleFocus}
          onChange={(e) => handleChangeKeyword(e.target.value)}
          placeholder={placeholder}
          className="h-13 w-full rounded-component-md border border-status-blue px-4 pl-5 font-body1 outline-none transition-colors placeholder:text-text-placeholder focus:border-status-blue"
        />
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-status-blue" />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-component-md border border-gray-200 bg-white shadow-sm">
          {filteredCandidates.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-2">
              {filteredCandidates.map((candidate) => (
                <li key={candidate.memberId}>
                  <button
                    type="button"
                    onClick={() => handleSelect(candidate)}
                    className="flex w-full items-center gap-3 px-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-text-placeholder/30">
                      {candidate.profileImageUrl ? (
                        <img
                          src={candidate.profileImageUrl}
                          alt={`${candidate.name} 프로필 이미지`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 text-text-auth-sub" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-body2 text-text-main">
                        {candidate.name}
                      </p>
                      <p className="truncate font-body2 text-text-sub">
                        {candidate.email}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 font-body2 text-text-sub">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
