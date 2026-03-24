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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-13 border-r-13 border-t-23 border-l-transparent border-r-transparent border-t-white" />
    </div>
  );
}
