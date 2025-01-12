import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { Providers } from "./providers";
import { router } from "./router";

// biome-ignore lint/style/noNonNullAssertion: this is a basic setup of react
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </HelmetProvider>
  </StrictMode>,
);
