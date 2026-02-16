import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Building, ChevronDown, LogOut } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { useAuth } from "@/app/providers/auth-provider";

export function AccountMenu() {
  const { session, isLoading: isLoadingProfile } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/sign-in";
          },
          onError: (ctx) => {
            console.error("Erro ao fazer logout:", ctx.error);
            setIsSigningOut(false);
          },
        },
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setIsSigningOut(false);
    }
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 select-none"
          >
            {user?.name}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Building className="w-4 h-4 mr-2" />
              <span>Perfil da loja</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            asChild
            className="text-rose-500 dark:text-rose-400"
            disabled={isSigningOut}
          >
            <button className="w-full" onClick={() => handleSignOut()}>
              <LogOut className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <StoreProfileDialog /> */}
    </Dialog>
  );
}
