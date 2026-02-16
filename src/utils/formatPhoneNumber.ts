export default function formatPhoneNumber(value: string): string {
  // 1. 숫자만 남기기
  const digits = value.replace(/\D/g, "").slice(0, 11);

  // 2. 조건부 하이픈 삽입
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
}
