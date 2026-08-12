import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { IDraftProfile, ISavedProfile } from "@/types/setting/settingPage";

import { useImageUploader } from "@/hooks/common/useImageUploader";

import { getMyInfo } from "@/api/auth/auth";

export default function useSettingProfile() {
  const [savedProfile, setSavedProfile] = useState<ISavedProfile>({
    name: "",
    profileImageUrl: null,
  });
  const [draftProfile, setDraftProfile] = useState<IDraftProfile>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    fileRef,
    file,
    preview,
    setPreview,
    openFilePicker,
    onPickFile,
    resetImage,
  } = useImageUploader();

  const hasProfileChanges = useMemo(() => {
    return (
      savedProfile.name !== draftProfile.name ||
      savedProfile.profileImageUrl !== preview ||
      !!file
    );
  }, [savedProfile, draftProfile, preview, file]);

  const setName = (name: string) =>
    setDraftProfile((prev) => ({ ...prev, name }));

  const resetProfileImage = () => {
    resetImage();
    setIsImageDeleted(true);
  };

  const handlePickFile = (e: ChangeEvent<HTMLInputElement>) => {
    setIsImageDeleted(false);
    onPickFile(e);
  };

  const applyAccountSaveSuccess = (res: ISavedProfile) => {
    setSavedProfile({
      name: res.name,
      profileImageUrl: res.profileImageUrl,
    });
    setDraftProfile((prev) => ({
      ...prev,
      name: res.name,
    }));
    setPreview(res.profileImageUrl);
    setIsImageDeleted(false);
  };

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setIsLoading(true);
        const res = await getMyInfo();

        setSavedProfile({
          name: res.data.name,
          profileImageUrl: res.data.profileImageUrl,
        });
        setDraftProfile({
          name: res.data.name,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber,
        });
        setPreview(res.data.profileImageUrl);
      } catch (error) {
        toast.error("회원 정보를 불러오는데 실패했습니다");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyInfo();
  }, [setPreview]);

  return {
    isLoading,
    draftProfile,
    setName,
    fileRef,
    file,
    preview,
    openFilePicker,
    handlePickFile,
    resetProfileImage,
    isImageDeleted,
    hasProfileChanges,
    applyAccountSaveSuccess,
  };
}
