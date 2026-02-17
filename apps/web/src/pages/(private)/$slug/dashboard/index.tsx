import { PersonTableContent } from "@/components/person/person-table-content";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/$slug/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Pessoas</h1>

      <PersonTableContent/>
    </div>
  );
}
