import { atomWithStorage } from "jotai/utils";

import { atomStorage } from "../lib/jotai";

export interface ITokenAtom {
  AccessToken: string | null;
  RefreshToken: string | null;
  ExpiresAt: string | null;
  IssuedAt: string | null;
  IsAuthenticated: boolean | null;
}

export const tokenAtom = atomWithStorage<ITokenAtom>(
  "token",
  {
    IsAuthenticated: false,
    AccessToken: null,
    RefreshToken: null,
    ExpiresAt: null,
    IssuedAt: null,
  },
  atomStorage<ITokenAtom>("cookie"),
);
