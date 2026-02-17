import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { AuthContextType } from "@/app/providers/auth-provider";

type RouterContext = {
  auth: AuthContextType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
