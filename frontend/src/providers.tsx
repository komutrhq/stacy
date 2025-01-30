import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, MotionConfig } from "framer-motion";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";

import Toaster from "@/components/sonner";
import Spin from "@/components/spin";
import { TooltipProvider } from "@/components/tooltip";
import { queryClient } from "@/lib/query-client";

const loadFeatures = () =>
  import("./framer-lazy-feature")
    .then((res) => res.default)
    .catch((error) => {
      console.error("Failed to load framer-motion features:", error);
      // Fallback to basic features or throw if critical
      throw error;
    });

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <LazyMotion features={loadFeatures} strict key="framer">
    <MotionConfig transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Spin />}>
          <TooltipProvider>{children}</TooltipProvider>
        </Suspense>
        <Toaster richColors />
      </QueryClientProvider>
    </MotionConfig>
  </LazyMotion>
);
