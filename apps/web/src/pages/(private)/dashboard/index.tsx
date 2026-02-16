import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    auth: { isAuthenticated, session },
  } = Route.useRouteContext();

  return (
    <div>
      Hello "/dashboard"!{" "}
      {isAuthenticated ? "Authenticated kk" : "Not authenticated"}{" "}
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
