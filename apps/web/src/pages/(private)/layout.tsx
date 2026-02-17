import { PrivateLayout } from "@/app/layouts/private-layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)")({
  beforeLoad: async ({ context, location, params }) => {
    const { isAuthenticated } = context.auth;
    const { slug } = params as { slug: string }
    if (!slug) {
      throw redirect({ to: "/sign-in", search: { from: location.href } });
    }
    if (!isAuthenticated) {
      throw redirect({ to: "/sign-in", search: { from: location.href } });
    }
  },
  component: PrivateRoute,
});

function PrivateRoute() {
  return <PrivateLayout />;
}
