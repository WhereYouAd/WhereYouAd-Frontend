import { type ComponentType, type ReactNode, Suspense } from "react";

type TPropsOf<T> = T extends ComponentType<infer P> ? P : never;

export function loadable<T extends ComponentType<any>>(
  Component: T,
  fallback: ReactNode = <div>Loading...</div>,
) {
  function Wrapped(props: TPropsOf<T>) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  }

  Wrapped.displayName = `Loadable(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
