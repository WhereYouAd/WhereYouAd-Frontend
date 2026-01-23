import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^010-\d{4}-\d{4}$/;
const realNamePattern = /^[가-힣]+$/;
const PasswordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,16}$/;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일은 필수입니다.")
  .regex(emailRegex, "이메일 형식을 다시 확인해 주세요");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "이름은 필수입니다.")
  .max(10, "이름은 10자 이내로 입력해주세요.")
  .regex(realNamePattern, "이름은 한글만 입력할 수 있습니다.")
  .min(2, "이름은 2자 이상 입력해주세요.");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "전화번호는 필수입니다.")
  .regex(phonePattern, "올바른 전화번호를 입력해주세요.");

export const passwordSchema = z
  .string()
  .min(1, "비밀번호는 필수입니다.")
  .regex(PasswordPattern, "영문, 숫자, 특수문자가 모두 들어간 8 -16글자");

export const codeSchema = z
  .string()
  .trim()
  .min(1, "인증코드를 반드시 입력해주세요.");

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    repassword: z.string().min(1, "비밀번호 확인은 필수입니다."),
    name: nameSchema,
    phoneNum: phoneSchema,
    code: codeSchema,
  })
  .refine((data) => data.password === data.repassword, {
    path: ["repassword"],
    message: "비밀번호와 비밀번호 확인이 일치하지 않아요.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
