import { useState } from "react";

import Button from "@/components/common/button/Button";
import Modal from "@/components/common/modal/Modal";

import AgreementItem from "./AgreementItem";

import marketingContent from "@/assets/docs/marketing-agreement.md?raw";
import privacyContent from "@/assets/docs/privacy-collection.md?raw";

type TAgreementType = "privacy" | "marketing";

type TPrivacyModalProps = {
  onClose: () => void;
  onAgree?: (agreements: { privacy: boolean; marketing: boolean }) => void;
  initialState?: { privacy: boolean; marketing: boolean };
};

export default function PrivacyModal({
  onClose,
  onAgree,
  initialState,
}: TPrivacyModalProps) {
  const [agreements, setAgreements] = useState({
    privacy: initialState?.privacy ?? false,
    marketing: initialState?.marketing ?? false,
  });

  const [expanded, setExpanded] = useState<Record<TAgreementType, boolean>>({
    privacy: false,
    marketing: false,
  });

  const toggleAgreement = (key: TAgreementType) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpand = (key: TAgreementType) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllAgree = () => {
    const allChecked = Object.values(agreements).every(Boolean);
    const newState = !allChecked;
    setAgreements({
      privacy: newState,
      marketing: newState,
    });
  };

  const handleConfirm = () => {
    if (!agreements.privacy) {
      return;
    }
    if (onAgree) {
      onAgree(agreements);
    }
    onClose();
  };

  const isAllChecked = Object.values(agreements).every(Boolean);

  const isRequiredChecked = agreements.privacy;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      disableOverlayClick
      padding="none"
      size="lg"
      className="w-125 max-h-[80vh] overflow-hidden"
    >
      <div className="flex flex-col w-full h-full">
        <div className="px-6 pt-8 pb-4">
          <h2 className="font-heading2 text-text-main">개인정보 수집 동의</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
          <div
            className="flex items-center gap-3 py-4 border-b border-gray-100 cursor-pointer"
            onClick={handleAllAgree}
          >
            <input
              type="checkbox"
              className="checkbox"
              checked={isAllChecked}
              readOnly
            />
            <span className="font-body1 font-bold text-text-main">
              전체 동의하기
            </span>
          </div>

          <div className="flex flex-col gap-6 mt-6">
            <AgreementItem
              label="개인정보 수집 및 이용 동의"
              required
              checked={agreements.privacy}
              expanded={expanded.privacy}
              onToggleCheck={() => toggleAgreement("privacy")}
              onToggleExpand={() => toggleExpand("privacy")}
              content={privacyContent}
            />
            <AgreementItem
              label="마케팅 정보 수신 동의"
              checked={agreements.marketing}
              expanded={expanded.marketing}
              onToggleCheck={() => toggleAgreement("marketing")}
              onToggleExpand={() => toggleExpand("marketing")}
              content={marketingContent}
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-white">
          <Button
            size="big"
            fullWidth
            variant="custom"
            onClick={handleConfirm}
            disabled={!isRequiredChecked}
            className="bg-status-blue text-white hover:opacity-90 disabled:bg-bg-disabled disabled:text-text-disabled disabled:opacity-100"
          >
            동의하고 계속하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
