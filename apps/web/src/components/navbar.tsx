import { Link } from "@tanstack/react-router";
import { useAuth } from "@/app/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "./account-menu";
import { ThemeToggle } from "./theme-toggle";

const activeProps = {
  className: "font-semibold text-primary",
};

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              MyApp
            </Link>

            {/* Navigation Links */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/dashboard"
                  activeProps={activeProps}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  inactiveProps={{
                    className:
                      "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/todo"
                  activeProps={activeProps}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  inactiveProps={{
                    className:
                      "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  }}
                >
                  To-Do
                </Link>
                {/* <Link
                  to="/search"
                  activeProps={activeProps}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  inactiveProps={{
                    className:
                      "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  }}
                >
                  Search
                </Link> */}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  activeProps={activeProps}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  inactiveProps={{
                    className:
                      "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  }}
                >
                  Home
                </Link>
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <ThemeToggle />
                <AccountMenu />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/sign-in">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Rotas Privadas */}
      {isAuthenticated && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                activeProps={activeProps}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                inactiveProps={{
                  className:
                    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2",
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/todo"
                activeProps={activeProps}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                inactiveProps={{
                  className:
                    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2",
                }}
              >
                To-Do
              </Link>
              {/* <Link
                to="/search"
                activeProps={activeProps}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                inactiveProps={{
                  className:
                    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2",
                }}
              >
                Search
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
