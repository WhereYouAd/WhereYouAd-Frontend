import { useState } from "react";
import { toast } from "sonner";

interface IUseControlModalProps {
  onSuccess?: () => void;
  successMessage: string;
  errorMessage: string;
}

export const useControlModal = ({
  onSuccess,
  successMessage,
  errorMessage,
}: IUseControlModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleConfirm = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
      toast.success(successMessage);
      onSuccess?.();
      closeModal();
    } catch {
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    handleConfirm,
  };
};
