import type { TWorkspaceMember } from "@/types/workspace/workspace";

import SearchSelect from "../common/select/SearchSelect";

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
  return (
    <SearchSelect
      options={candidates}
      selectedOption={selectedMember}
      onSelect={onSelect}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placeholder={placeholder}
      getOptionKey={(member) => member.memberId}
      getOptionLabel={(member) => member.name}
      getSearchText={(member) => `${member.name} ${member.email}`}
      renderOption={(member) => (
        <div className="flex items-center gap-3 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-text-placeholder/30">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt={`${member.name} 프로필 이미지`}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-text-auth-sub" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-body2 text-text-main">{member.name}</p>
            <p className="truncate font-body2 text-text-sub">{member.email}</p>
          </div>
        </div>
      )}
      emptyMessage="검색 결과가 없습니다"
    />
  );
}
