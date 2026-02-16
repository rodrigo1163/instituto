import { ErrorFallbackBoundary } from "@/components/error-fallback-boundary";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  children: React.ReactNode;
}

export function ErrorBoundaryProvider({ children }: Props) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorFallbackBoundary error={error} />}
    >
      {children}
    </ErrorBoundary>
  );
}
