import { ReactNode } from "react";
import { RouteObject } from "react-router-dom";

export interface UrlSearchParamState {
  [k: string]: string | null;
}

export interface RouteObjectConfig {
  login: CustomRouteObject;
  homepage: CustomRouteObject;
}

export type CustomRouteObject = RouteObject & {
  path: string;
  element: ReactNode;
  title: string;
};