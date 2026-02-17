import { fetchOrganizations } from "@/api/fetch-organizations";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/org/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => fetchOrganizations(),
  });
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar organizações</div>;
  if(data?.organizations.length === 0) return <Navigate to="/org/create-org" />
  return (
    <div>
      <h1>Organizações</h1>
      <ul>
        {data?.organizations.map((organization) => (
          <li key={organization.id}>{organization.name}</li>
        ))}
      </ul>
    </div>
  );
}
