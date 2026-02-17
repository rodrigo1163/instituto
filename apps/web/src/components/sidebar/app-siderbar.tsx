"use client";

import { Boxes, Cat, Key, LifeBuoy, MapPin, Send, Settings2, ShieldCheck, SquareTerminal, Truck, Users } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useParams } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavItems } from "./nav-items";

const navMainRoutes = [
  {
    title: 'Dashboard',
    url: `/`,
    icon: SquareTerminal,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { slug } = useParams({ strict: false }) as {
    slug?: string;
  };
  const location = useLocation();

   const navMain = useMemo(
    () =>
      navMainRoutes
        .map(item => {
          const orgUrl = slug
            ? `/${slug}${item.url}`
            : item.url

          return {
            ...item,
            url: orgUrl,
            isActive:
              location.pathname === orgUrl ||
              location.pathname.startsWith(`${orgUrl}/`),
          }
        }),
    [location.pathname, slug]
   )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
         <NavItems titleItems="Main" items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
