import CryptoJS from "crypto-js";

function parseKeyOrIv(value: string, label: string): CryptoJS.lib.WordArray {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} 환경 변수가 설정되지 않았습니다.`);
  }
  return CryptoJS.enc.Utf8.parse(trimmed);
}

/**
 * AES/CBC/PKCS7(PKCS5) → ciphertext Base64
 * Java AES/CBC/PKCS5Padding 과 맞추려면 ciphertext만 Base64 (Salt 없음)
 */
export function encryptAesCbcBase64(plainText: string): string {
  const secret = import.meta.env.VITE_NAVER_AES_SECRET as string | undefined;
  const iv = import.meta.env.VITE_NAVER_AES_IV as string | undefined;

  if (!secret || !iv) {
    throw new Error("네이버 연동 암호화 설정이 없습니다.");
  }

  const keyWordArray = parseKeyOrIv(secret, "VITE_NAVER_AES_SECRET");
  const ivWordArray = parseKeyOrIv(iv, "VITE_NAVER_AES_IV");

  const encrypted = CryptoJS.AES.encrypt(plainText, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
