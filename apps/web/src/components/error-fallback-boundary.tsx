import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

type ErrorBoundaryProps = {
  error: Error;
};

export function ErrorFallbackBoundary({ error }: ErrorBoundaryProps) {
  const supportNumber = "0800-123-456";
  const supportEmail = "suporte@empresa.com";
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2 p-4">
        <div className="max-w-sm m-auto w-full flex flex-col items-center">
          <div className="text-center  space-y-6">
            {/* Ícone e status */}
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full" aria-hidden="true">
                <AlertTriangle className="text-red-500 mx-auto size-10" />
              </div>
              <span className="mt-2 text-xs text-red-600 font-semibold uppercase tracking-wide">
                Erro inesperado
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Pode ser um erro temporário ou um problema na sua conexão. Tente
              recarregar a página.
              <br />
              <br />
              Se o problema persistir, entre em contato com o suporte pelo
              número <span className="font-semibold">{supportNumber}</span> ou
              pelo e-mail <span className="font-semibold">{supportEmail}</span>.
            </p>
            {process.env.NODE_ENV === "development" && error && (
              <details>
                <summary className="cursor-pointer text-sm text-gray-500">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {error.message}
                  {error.stack}
                </pre>
              </details>
            )}
            {/* Ação */}
            <Button
              variant="outline"
              size="sm"
              className="w-full max-w-xs"
              onClick={() => location.reload()}
              aria-label="Recarregar a página"
            >
              Recarregar a página
            </Button>
          </div>
        </div>
        <div className="bg-muted hidden lg:block rounded-lg" />
      </div>
    </div>
  );
}
