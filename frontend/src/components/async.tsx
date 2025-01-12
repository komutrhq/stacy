import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AsyncProps extends IComponentProps {
  // biome-ignore lint:
  request: () => Promise<unknown> | void;
  immediate?: boolean;
  // biome-ignore lint:
  deps?: any[];
  allowRetry?: boolean;
  cacheFirst?: boolean;
  skeleton?: ReactNode;
  emptyState?: ReactNode;
  noSkeleton?: boolean;
  errorRender?: (err: Error) => ReactNode;
}

export const Async: FC<AsyncProps> = ({
  className,
  style,
  request,
  immediate = true,
  deps = [],
  allowRetry = true,
  cacheFirst = false,
  noSkeleton = false,
  skeleton,
  emptyState,
  errorRender,
  children,
}) => {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [result, setResult] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const execute = useCallback(() => {
    setStatus("pending");
    setError(null);

    const attemptRequest = (retryCount: number) => {
      if (retryCount > 0) console.log("Attempt request:", retryCount);
      // biome-ignore lint:
      const promise: any = request();

      if (typeof promise?.then === "function") {
        promise
          // biome-ignore lint:
          .then((data: any) => {
            setResult(data);
            setStatus("success");
          })
          // biome-ignore lint:
          .catch((err: any) => {
            console.error(err);
            if (allowRetry && retryCount < 5) {
              setTimeout(() => attemptRequest(retryCount + 1), (retryCount + 1) * 1000);
            } else {
              setError(err);
              setStatus("error");
              navigate("/oops");
            }
          });
      } else {
        setResult(true);
        setStatus("success");
      }
    };

    attemptRequest(0);
  }, [request, allowRetry]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps.concat(immediate));

  return (
    <div className={className} style={style}>
      {status === "idle" && cacheFirst && children}
      {status === "pending" && (!cacheFirst && !noSkeleton ? skeleton : children)}
      {/* biome-ignore lint: */}
      {status === "error" && (errorRender ? errorRender(error!) : children)}
      {status === "success" && (!result && emptyState ? emptyState : children)}
    </div>
  );
};
