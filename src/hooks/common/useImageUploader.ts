import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

export function useImageUploader() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const openFilePicker = () => {
    fileRef.current?.click();
  };
  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    const url = URL.createObjectURL(f);
    setPreview(url);
  };
  const resetImage = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setFile(null);
    setPreview(null);
  };
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  });
  return { fileRef, file, preview, openFilePicker, onPickFile, resetImage };
}
