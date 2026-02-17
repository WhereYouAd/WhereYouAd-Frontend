import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^010-\d{4}-\d{4}$/;
const realNamePattern = /^[가-힣]+$/;
const passwordPattern =
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
  .regex(passwordPattern, "영문, 숫자, 특수문자가 모두 들어간 8-16글자");

export const codeSchema = z
  .string()
  .trim()
  .min(1, "인증코드를 반드시 입력해주세요.");

export const termsSchema = z.boolean().refine((val) => val === true);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupEmailSchema = z.object({
  email: emailSchema,
  code: codeSchema,
});

export const signupPasswordSchema = z
  .object({
    password: passwordSchema,
    repassword: z.string().min(1, "비밀번호 확인은 필수입니다."),
  })
  .refine((data) => data.password === data.repassword, {
    path: ["repassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export const signupProfileSchema = z.object({
  name: nameSchema,
  phoneNum: phoneSchema,
  terms: termsSchema,
  marketing: z.boolean().optional(),
});

export const findEmailSchema = z.object({
  phoneNum: phoneSchema,
  code: codeSchema,
});
