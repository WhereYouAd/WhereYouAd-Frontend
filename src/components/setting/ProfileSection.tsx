import type React from "react";

import Card from "@/components/common/card/Card";

import Button from "../common/button/Button";
import Input from "../common/input/Input";

import CameraIcon from "@/assets/icon/common/camera.svg?react";
import CheckIcon from "@/assets/icon/common/check.svg?react";
import UserProfileCircleIcon from "@/assets/icon/common/userProfileCircle.svg?react";

type TProfileSectionProps = {
  name: string;
  setName: (v: string) => void;
  email: string;
  phoneNumber: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  openFilePicker: () => void;
  onPickFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetImage: () => void;
};
export default function ProfileSection({
  name,
  setName,
  email,
  phoneNumber,
  fileRef,
  preview,
  onPickFile,
  openFilePicker,
  resetImage,
}: TProfileSectionProps) {
  return (
    <Card className="p-8 tablet:p-10">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div className="flex gap-4 items-center">
          <UserProfileCircleIcon />
          <h2 className="font-heading4 text-text-title">프로필</h2>
        </div>
      </header>
      <div className="flex tablet:flex-row gap-10">
        <div className="flex flex-col items-center basis-1/4 shrink-0">
          <div className="mb-4 w-full select-none text-text-title">
            프로필 이미지
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={onPickFile}
          />
          <button
            type="button"
            onClick={openFilePicker}
            aria-label="프로필 이미지 업로드 또는 변경"
            className="relative flex h-45 w-45 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-surface-400 bg-surface-200 outline-none transition-colors hover:bg-surface-300/70 focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            {preview ? (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <CameraIcon
                className="h-10 w-10 shrink-0 text-text-placeholder"
                aria-hidden
              />
            )}
          </button>
          <div className="mt-5 flex gap-3">
            <Button
              variant="custom"
              type="button"
              onClick={openFilePicker}
              className="h-7! rounded-3xl border border-surface-400 bg-surface-100 px-4 font-body2 text-text-auth-sub transition-colors duration-200 ease-in-out hover:bg-surface-200"
              aria-label="프로필 이미지 변경 버튼"
            >
              변경
            </Button>
            <Button
              variant="custom"
              type="button"
              onClick={resetImage}
              className="h-7! rounded-3xl border border-surface-400 bg-surface-100 px-4 font-body2 text-text-auth-sub transition-colors duration-200 ease-in-out hover:bg-surface-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="프로필 이미지 초기화 버튼"
              disabled={!preview}
            >
              초기화
            </Button>
          </div>
        </div>
        <div className="grid w-full basis-3/4 grid-cols-2 gap-x-6 gap-y-4 tablet:grid-cols-1 tablet:gap-y-5">
          <div className="col-span-2 tablet:col-span-1">
            <Input
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-1 group relative w-full">
            <Input
              label="이메일"
              value={email}
              disabled={true}
              rightElement={<CheckIcon className="h-6 w-6 text-primary-500" />}
              readOnly
            />
            <div className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded bg-surface-500 px-2 py-1 font-caption text-surface-100 opacity-0 transition-opacity group-hover:opacity-100">
              이메일은 변경할 수 없습니다.
            </div>
          </div>
          <div className="col-span-1 group relative w-full">
            <Input
              label="전화번호"
              value={phoneNumber}
              disabled={true}
              rightElement={<CheckIcon className="h-6 w-6 text-primary-500" />}
              readOnly
            />
            <div className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded bg-surface-500 px-2 py-1 font-caption text-surface-100 opacity-0 transition-opacity group-hover:opacity-100">
              전화번호는 변경할 수 없습니다.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
