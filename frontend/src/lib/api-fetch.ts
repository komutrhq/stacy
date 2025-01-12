import Cookies from "js-cookie";
import { FetchError, type FetchOptions, ofetch } from "ofetch";

import type { ITokenAtom } from "@/atoms/auth";
import { ApiError } from "@/error/api";
import type { IRefreshTokenResponse } from "@/models/auth";
import { env } from "@env";

import { getStorage, setStorage } from "./jotai";

let refreshPromise: Promise<IRefreshTokenResponse> | null = null;
let refreshCount = 0;

const OfetchBaseConfig: FetchOptions = {
  credentials: "include",
  retry: 3,
  retryDelay: 750,
  retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
  onRequest: async ({ options }) => {
    const header = new Headers(options.headers);

    // Atom for access token can't wait until the whole atom is loaded. Thus
    // we need to use getStorage to get the value of the atom directly from the
    // local storage.
    const token = getStorage<ITokenAtom>("token", {}, "cookie");

    if (!["/register", "/", "", "/login"].includes(window.location.pathname)) {
      header.set("Authorization", `Bearer ${token.AccessToken}`);
    }

    options.headers = header;

    if (options.method && options.method.toLowerCase() !== "get") {
      if (typeof options.body === "string") {
        options.body = JSON.parse(options.body);
      }
      if (!options.body) {
        options.body = {};
      }
    }
  },
  onResponse() {
    // TODO: response interceptor
  },
  async onResponseError(context) {
    if (context.request.toString().includes("/refresh-token") && context.response.status >= 500) {
      return redirectToLogin();
    }

    if (context.response.status === 401) {
      await refreshToken();
    }

    throw new ApiError(context.response._data.error);
  },
};

export const apiFetch = ofetch.create({
  ...OfetchBaseConfig,
  baseURL: env.VITE_API_URL.replace(/\/+$/, ""), // Remove trailing slash if any
});

function redirectToLogin() {
  if (window.location.pathname === "/login") return;

  for (const key of ["register", "token"]) {
    Cookies.remove(Buffer.from(key).toString("base64"));
  }

  localStorage.clear();

  window.location.href = "/login?sessionExpired=true";
}

export const getFetchErrorMessage = (error: Error) => {
  if (error instanceof FetchError) {
    try {
      const json = error.response?._data;
      const { message } = json;
      return `${message || error.message}`;
    } catch {
      return error.message;
    }
  }

  return error.message;
};

export const refreshToken = async () => {
  if (refreshPromise) {
    // Await the existing refreshPromise
    return refreshPromise;
  } else if (refreshCount >= 3) {
    redirectToLogin();
    throw new Error("Maximum refresh attempts exceeded");
  }

  if (!refreshPromise && refreshCount < 3) {
    try {
      const token = getStorage<ITokenAtom>("token", {}, "cookie");

      refreshPromise = apiFetch<IRefreshTokenResponse>("/refresh-token", {
        method: "POST",
        body: {
          refresh_token: token.RefreshToken,
        },
      });
      const res = await refreshPromise;

      setStorage<ITokenAtom>(
        "token",
        {
          AccessToken: res.AccessToken,
          RefreshToken: token.RefreshToken,
          ExpiresAt: token.ExpiresAt,
          IssuedAt: token.IssuedAt,
          IsAuthenticated: true,
        },
        "cookie",
      );

      refreshCount = 0;
      return res;
    } catch {
      refreshCount++;
      throw new Error("Token refresh failed");
    } finally {
      refreshPromise = null;
    }
  }
};
