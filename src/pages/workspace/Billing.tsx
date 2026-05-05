import ComingSoonPlaceholder from "@/components/common/ComingSoonPlaceholder";

export default function Billing() {
  return (
    <ComingSoonPlaceholder
      title={
        <>
          <span className="block">플랜 및 결제 기능을</span>
          <span className="block">준비하고 있어요</span>
        </>
      }
      description={
        <>
          <span className="block">
            플랜 선택과 결제 정보를 편하게 관리할 수 있는
          </span>
          <span className="block">기능을 열심히 만들고 있습니다.</span>
        </>
      }
      footer="정식 오픈 후 이용하실 수 있습니다"
    />
  );
}
