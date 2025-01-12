import { Buffer } from "node:buffer";
import type { Atom, PrimitiveAtom } from "jotai";
import { createStore, useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import type { AsyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import Cookies from "js-cookie";
import { useCallback } from "react";

export const jotaiStore = createStore();

export const createAtomAccessor = <T>(atom: PrimitiveAtom<T>) => [() => jotaiStore.get(atom), (value: T) => jotaiStore.set(atom, value)] as const;

const options = { store: jotaiStore };
/**
 * @param atom - jotai
 * @returns - [atom, useAtom, useAtomValue, useSetAtom, jotaiStore.get, jotaiStore.set]
 */
export const createAtomHooks = <T>(atom: PrimitiveAtom<T>) =>
  [
    atom,
    () => useAtom(atom, options),
    () => useAtomValue(atom, options),
    () => useSetAtom(atom, options),
    ...createAtomAccessor(atom),
    createAtomSelector(atom),
  ] as const;

// @ts-ignore
const noop = [];
const createAtomSelector = <T>(atom: Atom<T>) => {
  // @ts-ignore
  // biome-ignore lint:
  const useHook = <R>(selector: (a: T) => R, deps: any[] = noop) =>
    useAtomValue(
      selectAtom(
        atom,
        useCallback((a) => selector(a as T), deps),
      ),
    );

  return useHook;
};

export type StorageType = "local_storage" | "cookie";

export const atomStorage = <T>(storage: StorageType = "local_storage"): AsyncStorage<T> => {
  return {
    getItem: (key: string, initialValue: T): PromiseLike<T> => {
      return new Promise<T>((resolve) => resolve(getStorage(key, initialValue, storage)));
    },
    setItem: (key: string, value: T) => {
      return new Promise<void>((resolve) => {
        setStorage(key, value, storage);
        resolve();
      });
    },
    removeItem: (key: string) => {
      return new Promise<void>((resolve) => {
        localStorage.removeItem(key);
        resolve();
      });
    },
  };
};

export const getStorage = <T>(key: string, initialValue: Partial<T>, storage: StorageType = "local_storage"): T => {
  const storedKey = Buffer.from(key).toString("base64");

  let storedValue: string | null | undefined;
  if (storage === "local_storage") {
    storedValue = localStorage.getItem(storedKey);
  } else {
    storedValue = Cookies.get(storedKey);
  }

  try {
    return JSON.parse(Buffer.from(storedValue ?? "", "base64").toString());
  } catch {
    return initialValue as T;
  }
};

// biome-ignore lint:
export const setStorage = <T = any>(key: string, value: T, storage: StorageType = "local_storage") => {
  const storedKey = Buffer.from(key).toString("base64");
  const storedValue = Buffer.from(JSON.stringify(value)).toString("base64");

  if (storage === "local_storage") {
    localStorage.setItem(storedKey, storedValue);
  } else {
    Cookies.set(storedKey, storedValue);
  }
};

export const clearStorage = (key: string, storage: StorageType = "local_storage") => {
  const storedKey = Buffer.from(key).toString("base64");

  if (storage === "local_storage") {
    localStorage.removeItem(storedKey);
  } else {
    Cookies.remove(storedKey);
  }
};

export const clearAllStorage = () => {
  const storageItems: { key: string; storage: StorageType }[] = [
    { key: "address", storage: "local_storage" },
    { key: "cartpopup", storage: "local_storage" },
    { key: "chat", storage: "cookie" },
    { key: "countryAtom", storage: "local_storage" },
    { key: "countryCodeAtom", storage: "local_storage" },
    { key: "currencyAtom", storage: "local_storage" },
    { key: "language", storage: "local_storage" },
    { key: "membership-placeholder", storage: "local_storage" },
    { key: "membership", storage: "local_storage" },
    { key: "module", storage: "local_storage" },
    { key: "paymentMethod", storage: "local_storage" },
    { key: "register", storage: "cookie" },
    { key: "shop", storage: "local_storage" },
    { key: "subscription", storage: "local_storage" },
    { key: "token", storage: "cookie" },
    { key: "upgrade-corporate-placeholder", storage: "local_storage" },
    { key: "user", storage: "local_storage" },
  ];

  for (const element of storageItems) {
    clearStorage(element.key, element.storage);
  }
};
