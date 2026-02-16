import { Navbar } from "@/components/navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)")({
  beforeLoad: async ({ context, location }) => {
    const { isAuthenticated } = context.auth;
    if (!isAuthenticated) {
      throw redirect({ to: "/sign-in", search: { from: location.href } });
    }
  },
  component: PrivateRoute,
});

function PrivateRoute() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
