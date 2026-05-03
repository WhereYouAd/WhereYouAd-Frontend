import Button from "@/components/common/button/Button";
import PageHeader from "@/components/common/PageHeader";
import PasswordSection from "@/components/setting/PasswordSection";
import ProfileSection from "@/components/setting/ProfileSection";

export default function Setting() {
  return (
    <section className="w-full flex flex-col gap-8">
      <PageHeader
        title="개인 설정"
        description="개인 프로필 정보와 비밀번호를 이곳에서 통합하여 관리할 수 있습니다"
      />
      <div className="flex flex-col gap-6">
        <ProfileSection />
        <PasswordSection />
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          type="button"
          size="big"
          aria-label="개인 설정 변경사항 저장 버튼"
        >
          변경사항 저장하기
        </Button>
      </div>
    </section>
  );
}
