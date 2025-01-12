import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import ErrorElement from "./components/error-element";
import NotFound from "./components/not-found";
import { buildGlobRoutes } from "./lib/route-builder";

const globTree = import.meta.glob(["./pages/**/*.tsx", "!./pages/**/components/**/*.tsx", "!./pages/**/_components/**/*.tsx"]);

const tree = buildGlobRoutes(globTree);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: tree,
    errorElement: <ErrorElement />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export type RouterType = typeof router;
