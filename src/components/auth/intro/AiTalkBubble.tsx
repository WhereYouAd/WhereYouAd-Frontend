import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";

interface IAiTalkBubbleProps {
  text: string;
}

export default function AiTalkBubble({ text }: IAiTalkBubbleProps) {
  return (
    <div className="relative drop-shadow-sm mb-6">
      <div className="flex items-center gap-3 rounded-component-md bg-white px-5 py-4 whitespace-nowrap">
        <SparkleIcon className="w-6 h-6 shrink-0" />
        <span className="font-body1 text-text-sub">{text}</span>
      </div>
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full"
        width="26"
        height="14"
        viewBox="0 0 26 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0 L13 14 L26 0 Z" fill="white" />
      </svg>
    </div>
  );
}
