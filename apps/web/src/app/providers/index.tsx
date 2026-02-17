import { ThemeProvider } from "@/app/providers/theme-provider";
import { AuthProvider } from "@/app/providers/auth-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return (
    <ErrorBoundaryProvider>
      <AuthProvider>
        <QueryProvider>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </AuthProvider>
    </ErrorBoundaryProvider>
  );
}
