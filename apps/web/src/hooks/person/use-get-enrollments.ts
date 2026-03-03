import { fetchEnrollments } from "@/api/fetch-enrollments";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

interface UseGetEnrollmentsParams {
  personId: string | undefined;
}

export function useGetEnrollments({ personId }: UseGetEnrollmentsParams) {
  const { slug } = useParams({ strict: false });

  const query = useSuspenseQuery({
    queryKey: ["enrollments", slug, personId],
    queryFn: () => fetchEnrollments({ personId, slug: slug! }),
  });

  return query;
}
