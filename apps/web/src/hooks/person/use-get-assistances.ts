import { fetchAssistances } from "@/api/fetch-assistances";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

interface UseGetAssistancesParams {
  personId: string | undefined;
}

export function useGetAssistances({ personId }: UseGetAssistancesParams) {
  const { slug } = useParams({ strict: false });

  const query = useSuspenseQuery({
    queryKey: ["assistances", slug, personId],
    queryFn: () => fetchAssistances({ personId, slug: slug! }),
  });

  return query;
}
