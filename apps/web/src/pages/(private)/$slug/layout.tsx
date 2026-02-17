import { PrivateLayout } from "@/app/layouts/private-layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/$slug")({
  component: PrivateWithOrganizationRoute,
  loader: async ({ location, params }) => { 
    const { slug } = params
    
    if (!slug) {
      throw redirect({ to: "/org", search: { from: location.href } })
    }
  }
});

function PrivateWithOrganizationRoute() {
  
  return <PrivateLayout />;
}
