import type { HTMLAttributes, ReactNode } from "react";

declare global {
  export const APP_DEV_CWD: string;
  export const GIT_COMMIT_SHA: string;
  export const DEBUG: boolean;
  export const dependencies: Record<string, string>;
  export const devDependencies: Record<string, string>;
  export const README: string;
  export const pkg: IPKG;

  type IComponentProps<E = HTMLElement> = HTMLAttributes<E>;
  type IKeyType = string | number;
  type IValueType = IKeyType | boolean;
  // biome-ignore lint:
  type IMapType<V = any> = Record<string | number | symbol, V>;
  type IOptionType = IMapType<IValueType> & {
    label: ReactNode;
    value: IValueType;
    disabled?: boolean;
  };
}

export interface IPKG {
  name: string;
  type: string;
  version: string;
  private: boolean;
  homepage: string;
  repository: Repository;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  description: string;
  author: string;
}

export interface Repository {
  url: string;
  type: string;
}
