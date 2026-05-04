import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Modal from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Common/Modal",
  component: Modal,
  parameters: { layout: "centered" },
};

export default meta;
type TModalStory = StoryObj<typeof Modal>;

function EnsureModalRoot() {
  useEffect(() => {
    let el = document.getElementById("modal-root");
    let created = false;
    if (!el) {
      created = true;
      el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
    }
    return () => {
      if (created) el?.remove();
    };
  }, []);
  return null;
}

export const Default: TModalStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <EnsureModalRoot />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-button-small px-4 rounding-15 bg-status-blue text-white font-body2 hover:bg-status-blue/80 transition"
          aria-label="모달 열기 버튼"
        >
          모달 열기
        </button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Modal Title"
          size="md"
          padding="md"
        >
          <div className="space-y-4">
            <p className="font-body2 text-text-main">모달 내용부분</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-button-small px-4 rounding-15 bg-brand-300 font-body2 hover:bg-text-main/15 transition-fast"
                aria-label="모달 닫기 버튼"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => alert("확인")}
                className="h-button-small px-4 rounding-15 bg-status-blue text-white font-body2 hover:bg-status-blue/80 transition-fast"
                aria-label="모달 확인"
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
