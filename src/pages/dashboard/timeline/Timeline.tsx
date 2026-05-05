import ComingSoonPlaceholder from "@/components/common/ComingSoonPlaceholder";

export default function Timeline() {
  return (
    <ComingSoonPlaceholder
      title={
        <>
          <span className="block">성과 타임라인을</span>
          <span className="block">준비하고 있어요</span>
        </>
      }
      description={
        <>
          <span className="block">캠페인 흐름을 한눈에 파악할 수 있도록,</span>
          <span className="block">더 유용한 기능으로 찾아올게요.</span>
        </>
      }
      footer="조금만 기다려 주시면 감사하겠습니다"
    />
  );
}
