import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import "@/index.css";

import { ErrorBoundary } from "@/components/error-boundary";
import { Providers } from "@/providers";
import { router } from "@/router";

// biome-ignore lint/style/noNonNullAssertion: this is a basic setup of react
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Providers>
          <Theme accentColor="grass" radius="small" grayColor="sage" appearance="light" panelBackground="solid">
            <RouterProvider router={router} />
          </Theme>
        </Providers>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
