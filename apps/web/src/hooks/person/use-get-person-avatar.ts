import { getPersonAvatar } from "@/api/get-person-avatar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

interface UseGetPersonAvatarParams {
  personId: string | undefined;
}

export function useGetPersonAvatar({ personId }: UseGetPersonAvatarParams) {
  const { slug } = useParams({ strict: false });

  const query = useQuery({
    queryKey: ["person-avatar", slug, personId],
    queryFn: () => getPersonAvatar({ personId, slug: slug! }),
    enabled: !!personId && !!slug,
  });

  return query;
}
