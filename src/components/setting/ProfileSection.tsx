import type React from "react";

import Button from "../common/button/Button";
import Input from "../common/input/Input";

import CameraIcon from "@/assets/icon/common/camera.svg?react";
import CheckIcon from "@/assets/icon/common/check.svg?react";
import UserProfileCircleIcon from "@/assets/icon/common/userProfileCircle.svg?react";

type TProfileSectionProps = {
  name: string;
  setName: (v: string) => void;
  organizations: { name: string; position: string }[];
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
  organizations,
  email,
  phoneNumber,
  fileRef,
  preview,
  onPickFile,
  openFilePicker,
  resetImage,
}: TProfileSectionProps) {
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
      <div className="flex tablet:flex-row gap-10">
        <div className="flex flex-col items-center basis-1/4 shrink-0">
          <div className="w-full text-text-main mb-4 select-none">
            프로필 이미지
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={onPickFile}
          />
          <div className="relative h-60 w-60 overflow-hidden rounded-full border border-gray-100 bg-gray-100 shadow-sm flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="프로필 이미지 미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <CameraIcon className="text-text-disabled w-10 h-10" />
            )}
          </div>
          <div className="mt-5 flex gap-3">
            <Button
              variant="custom"
              type="button"
              onClick={openFilePicker}
              className="h-7! border border-gray-200 text-text-auth-sub px-4 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              aria-label="프로필 이미지 변경 버튼"
            >
              변경
            </Button>
            <Button
              variant="custom"
              type="button"
              onClick={resetImage}
              className="h-7! border border-gray-200 text-text-auth-sub px-4 rounded-component-lg bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="프로필 이미지 초기화 버튼"
              disabled={!preview}
            >
              초기화
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-6 basis-3/4 gap-y-5 w-full">
          <div className="col-span-2">
            <Input
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <div className="text-text-main mb-2 ml-1">소속 조직</div>
            {organizations.length === 0 ? (
              <div className="text-text-disabled font-body2 ml-1">
                소속된 조직이 없습니다.
              </div>
            ) : (
              <>
                <div className="flex gap-4 px-1 mb-1 text-text-sub">
                  <div className="flex-1 font-body2">조직</div>
                  <div className="flex-1 font-body2">직책</div>
                </div>
                <div className="group relative flex flex-col gap-4">
                  {organizations.map((org, idx) => (
                    <div key={idx} className="flex gap-4 ">
                      <div className="flex-1">
                        <Input
                          value={org.name}
                          disabled
                          inputClassName="text-text-main"
                          containerClassName="bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={org.position}
                          disabled
                          inputClassName="text-text-sub"
                          containerClassName="bg-gray-100"
                          readOnly
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    조직 정보는 별도 조직페이지에서 수정할 수 있습니다.
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="col-span-2 group relative w-full">
            <Input
              label="이메일"
              value={email}
              disabled={true}
              rightElement={<CheckIcon className="w-6 h-6 text-chart-3" />}
              readOnly
            />
            <div className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              이메일은 변경할 수 없습니다.
            </div>
          </div>
          <div className="col-span-2 group relative w-full">
            <Input
              label="전화번호"
              value={phoneNumber}
              disabled={true}
              rightElement={<CheckIcon className="w-6 h-6 text-chart-3" />}
              readOnly
            />
            <div className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              전화번호는 변경할 수 없습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
