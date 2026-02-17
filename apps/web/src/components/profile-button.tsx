import { ChevronDown, LogOut, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/app/providers/auth-provider";
import { Link } from "@tanstack/react-router";

export async function ProfileButton() {
  const { session } = useAuth();

  function getInitials(name: string): string {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    return initials;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="font-medium text-sm">{session?.user.name}</span>
          <span className="text-muted-foreground text-xs">
            {session?.user.email}
          </span>
        </div>

        <Avatar className="size-8">
          {session?.user.image && <AvatarImage src={session?.user.image} />}
          {session?.user.name && (
            <AvatarFallback>{getInitials(session?.user.name)}</AvatarFallback>
          )}
        </Avatar>

        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/">
            <UserPlus className="mr-2 size-4" />
            Criar usuário
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
