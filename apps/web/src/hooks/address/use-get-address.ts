import { getAddress } from "@/api/get-address";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

interface UseGetAddressParams {
  personId: string | undefined;
}

export function useGetAddress({ personId }: UseGetAddressParams) {
  const { slug } = useParams({ strict: false });

  const query = useSuspenseQuery({
    queryKey: ["address", slug, personId],
    queryFn: () => getAddress({ personId, slug: slug! }),
  });
  return query;
}
