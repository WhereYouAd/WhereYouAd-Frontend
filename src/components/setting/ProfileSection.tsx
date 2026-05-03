import { useState } from "react";

import Button from "../common/button/Button";
import Input from "../common/input/Input";

import CameraIcon from "@/assets/icon/common/camera.svg?react";
import UserProfileCircleIcon from "@/assets/icon/common/userProfileCircle.svg?react";

export default function ProfileSection() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [position, setPosition] = useState("");
  const [email] = useState("");
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
      <div className="flex gap-7">
        <div className="flex flex-col items-center w-40 tablet:w-full shrink-0">
          <div className="w-full items-start text-text-main mb-3 ml-1 select-none tablet:text-center">
            프로필 이미지
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-component-md border border-gray-100 bg-gray-100 tablet:h-46 tablet:w-46">
            <CameraIcon className="text-text-disabled" />
          </div>
          <div className="mt-2 items-center">
            <Button
              variant="custom"
              type="button"
              className="h-7! border border-gray-200 text-text-auth-sub px-4 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              aria-label="프로필 이미지 변경 버튼"
            >
              변경
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="조직명"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
          <div className="flex gap-7">
            <Input
              label="직책"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <div className="group relative w-full">
              <Input label="이메일" value={email} disabled={true} />
              <div className="pointer-events-none absolute -bottom-5 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                이메일은 변경할 수 없습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
