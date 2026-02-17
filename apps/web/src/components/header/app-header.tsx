import { ChevronDown, Cog, Plus, School } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "../sidebar/nav-projects";
import { PendingInvites } from "../pending-invites";
import { ThemeSwitcher } from "../theme/theme-switcher";

interface AppHeaderProps {
  application?: string;
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
}

export function AppHeader({
  application = "Instituição 1",
  userAvatar = "https://github.com/shadcn.png",
  userName = "Rodrigo Silva de Sena",
  userEmail = "rodrigo.sena@enablers.com.br",
}: AppHeaderProps) {
  const { slug } = useParams({ strict: false });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left section with dropdowns */}
        <div className="flex items-center justify-center gap-1 md:gap-2">
          {/* Sidebar Trigger - Mobile Only */}
          <SidebarTrigger className="md:hidden" />

          {/* Settings Icon */}
          <Link
            to="/$slug/dashboard"
            params={{ slug: slug ?? "" }}
            className="hidden md:flex items-center justify-center size-6 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            aria-label="Settings"
          >
            <School  className="size-6" />
          </Link>

          <Separator orientation="vertical" className="h-6 my-auto rotate-12" />

          {/* Application Section */}
          <div className="flex items-center gap-2">
            {slug ? (
              <Link
                to="/$slug/dashboard"
                params={{ slug }}
                className="text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-md p-2 truncate max-w-[100px] md:max-w-none"
              >
                {application}
              </Link>
            ) : (
              <span className="text-sm font-medium text-sidebar-foreground rounded-md p-2 truncate max-w-[100px] md:max-w-none">
                {application}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-md p-2">
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Instituições
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 p-2">
                  Instituição 1
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 p-2">
                  Instituição 2
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 p-2">
                  Instituição 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <PendingInvites />
          <NavUser
            user={{
              name: userName,
              email: userEmail,
              avatar: userAvatar,
            }}
          />
        </div>
      </div>
    </header>
  );
}
