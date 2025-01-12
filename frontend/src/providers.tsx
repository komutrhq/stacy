import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, MotionConfig } from "framer-motion";
import type { FC, PropsWithChildren } from "react";

import Toaster from "./components/sonner";
import { TooltipProvider } from "./components/tooltip";
import { queryClient } from "./lib/query-client";

const loadFeatures = () => import("./framer-lazy-feature").then((res) => res.default);

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <LazyMotion features={loadFeatures} strict key="framer">
    <MotionConfig transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors />
      </QueryClientProvider>
    </MotionConfig>
  </LazyMotion>
);
