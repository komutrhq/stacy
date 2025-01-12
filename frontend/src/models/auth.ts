import { z } from "zod";

export const LoginFormRequestSchema = z.object({
  Email: z.string().min(1, { message: "Email is required" }).email(),
  Password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export const LoginFormResponseSchema = z.object({
  AccessToken: z.string(),
  RefreshToken: z.string(),
  ExpiresAt: z.string().datetime(),
  IssuedAt: z.string().datetime(),
});

export type ILoginFormRequest = z.infer<typeof LoginFormRequestSchema>;
export type ILoginFormResponse = z.infer<typeof LoginFormResponseSchema>;

export const RefreshTokenResponseSchema = LoginFormResponseSchema;

export type IRefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
