import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const isDev = import.meta.env.DEV;

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_NAME: z.string(),
    VITE_ENABLE_DEVTOOLS: z.string().default("false").transform((s) => s !== "false" && s !== "0"),
    VITE_EDITOR: z.string().default("vscode"),
    VITE_ENABLE_MOCK: z.string().default(isDev.toString()).transform((s) => s !== "false" && s !== "0"),
    VITE_APP_URL: z.string().url().transform((url) => url.replace(/\/+$/, "")),
    VITE_API_URL: z.string().url().transform((url) => url.replace(/\/+$/, "")),
    VITE_POSTHOG_KEY: z.string(),
    VITE_POSTHOG_HOST: z.string(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
  skipValidation: !isDev,
});
