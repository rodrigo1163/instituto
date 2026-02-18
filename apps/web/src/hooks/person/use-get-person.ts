import { getPerson } from "@/api/get-person";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

interface UseGetPersonParams {
  personId: string | undefined;
}

export function useGetPerson({ personId }: UseGetPersonParams) {
  const { slug } = useParams({ strict: false });

  const query = useSuspenseQuery({
    queryKey: ["persons", slug, personId],
    queryFn: () => getPerson({ personId, slug: slug! }),
  });
  return query;
}
