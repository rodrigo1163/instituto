import { fetchPersons, type FetchPersonsParams, type FetchPersonsResponse, type Person } from "@/api/fetch-persons";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export function useFetchPersons({ search }: Pick<FetchPersonsParams, 'search'>) {
  const { slug } = useParams({ strict: false });
  console.log(search);
  const query = useQuery<FetchPersonsResponse, Error>({
    queryKey: ['persons', slug, String(search)],
    queryFn: () => fetchPersons({ slug: slug!, search }),
  });
  return query;
}
