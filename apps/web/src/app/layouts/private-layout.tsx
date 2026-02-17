import { AppHeader } from "@/components/header/app-header";
import { AppSidebar } from "@/components/sidebar/app-siderbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";

export function PrivateLayout() {
  return (
    <SidebarProvider>
      <AppHeader />
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}