import { readFileSync } from "node:fs";

import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { getGitHash } from "./scripts/lib.ts";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const readme = readFileSync("README.md", "utf8");

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      tsconfigPaths(),
      react(),
       
    ],
    define: {
      APP_VERSION: JSON.stringify(pkg.version),
      APP_NAME: JSON.stringify(pkg.name),
      GIT_COMMIT_SHA: JSON.stringify(getGitHash()),
      dependencies: JSON.stringify(pkg.dependencies),
      devDependencies: JSON.stringify(pkg.devDependencies),
      README: JSON.stringify(readme),
      pkg: JSON.stringify(pkg)
    },
    server: {
      port: 8080,
    },
     
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    }
  };
});
