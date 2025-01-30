/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALLOW_GOOGLE_SSO: string;
  readonly VITE_ALLOW_GITHUB_SSO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
