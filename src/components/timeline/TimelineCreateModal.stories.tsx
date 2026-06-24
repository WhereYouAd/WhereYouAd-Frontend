import { useEffect, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import TimelineCreateModal from "./TimelineCreateModal";

const meta: Meta<typeof TimelineCreateModal> = {
  title: "Timeline/CreateModal",
  component: TimelineCreateModal,
  parameters: { layout: "fullscreen" },
  args: {
    onClose: fn(),
  },
};

export default meta;
type TStory = StoryObj<typeof TimelineCreateModal>;

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

function ValidationErrorsPreview() {
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const timer = window.setTimeout(() => {
      const submitButton = document.querySelector<HTMLButtonElement>(
        'button[type="submit"]',
      );
      submitButton?.click();
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <EnsureModalRoot />
      <TimelineCreateModal isOpen onClose={fn()} />
    </>
  );
}

function SubmittingPreview() {
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const timer = window.setTimeout(() => {
      const nameInput = document.querySelector<HTMLInputElement>(
        'input[placeholder="예) 6월 봄 프로모션"]',
      );
      const startInput =
        document.querySelector<HTMLInputElement>('input[type="date"]');
      const endInputs =
        document.querySelectorAll<HTMLInputElement>('input[type="date"]');

      if (nameInput) nameInput.value = "스토리북 테스트";
      if (startInput) startInput.value = "2026-06-01";
      if (endInputs) endInputs[1].value = "2026-06-30";

      const metricButton = document.querySelector<HTMLButtonElement>(
        'button[aria-pressed="false"]',
      );
      metricButton?.click();

      const submitButton = document.querySelector<HTMLButtonElement>(
        'button[type="submit"]',
      );
      submitButton?.click();
    }, 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <EnsureModalRoot />
      <TimelineCreateModal isOpen onClose={fn()} />
    </>
  );
}

export const Default: TStory = {
  render: () => (
    <>
      <EnsureModalRoot />
      <TimelineCreateModal isOpen onClose={fn()} />
    </>
  ),
};

export const ValidationErrors: TStory = {
  render: () => <ValidationErrorsPreview />,
};

export const Submitting: TStory = {
  render: () => <SubmittingPreview />,
};
