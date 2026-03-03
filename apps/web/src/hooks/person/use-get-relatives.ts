import { getRelatives } from "@/api/get-relatives";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

interface UseGetRelativesParams {
  personId: string | undefined;
}

export function useGetRelatives({ personId }: UseGetRelativesParams) {
  const { slug } = useParams({ strict: false });

  const query = useSuspenseQuery({
    queryKey: ["relatives", slug, personId],
    queryFn: () => getRelatives({ personId, slug: slug! }),
  });

  return query;
}

