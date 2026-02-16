import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/org/$slug/animals/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: `Animais da teste`,
      },
    ],
  }),
  loader: async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return { slug: params.slug };
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error</div>,
  notFoundComponent: () => <div>Not Found</div>,
});

function RouteComponent() {
  const { animal } = Route.useLoaderData();
  return <div>{animal.name}</div>;
}
