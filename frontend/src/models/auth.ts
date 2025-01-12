import { z } from "zod";

export const LoginFormRequestSchema = z.object({
  Email: z.string().min(1, { message: "Email is required" }).email(),
  Password: z.string().min(1, { message: "Password is required" }),
});

export const LoginFormResponseSchema = z.object({
  AccessToken: z.string(),
  RefreshToken: z.string(),
  ExpiresAt: z.string(),
  IssuedAt: z.string(),
});

export type ILoginFormRequest = z.infer<typeof LoginFormRequestSchema>;
export type ILoginFormResponse = z.infer<typeof LoginFormResponseSchema>;

export const RefreshTokenResponseSchema = z.object({
  AccessToken: z.string(),
  RefreshToken: z.string(),
  ExpiresAt: z.string(),
  IssuedAt: z.string(),
});

export type IRefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
