import UserProfileCircleIcon from "@/assets/icon/common/userProfileCircle.svg?react";

export default function ProfileSection() {
  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div className="flex gap-4 items-center">
          <UserProfileCircleIcon />
          <h2 className="font-heading4 text-text-main font-semibold!">
            프로필
          </h2>
        </div>
      </header>
    </div>
  );
}
