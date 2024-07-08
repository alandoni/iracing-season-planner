/* eslint-disable @typescript-eslint/no-explicit-any */
import { LazyExoticComponent, Suspense, lazy } from "react";
import { LoadingPage } from "./loading_page";

export function useLazyLoadComponent(
  factory: Promise<any>,
  componentName = "",
  isImportedAsDefault?: boolean
) {
  let component: LazyExoticComponent<any>;
  if (isImportedAsDefault) {
    component = lazy(() => factory);
  } else if (componentName.length > 0) {
    component = lazy(async () => {
      const module = await factory.then();
      return { default: module[componentName] };
    });
  } else {
    throw "You must provide a component name if isImportedAsDefault is false";
  }
  return component;
}

export interface LazyPageLoadProps {
  factory: Promise<any>;
  componentName?: string;
  isImportedAsDefault?: boolean;
}

export function LazyPageLoad({
  factory,
  componentName = "",
  isImportedAsDefault = false,
}: LazyPageLoadProps) {
  const Page = useLazyLoadComponent(
    factory,
    componentName,
    isImportedAsDefault
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <Page />
    </Suspense>
  );
}
