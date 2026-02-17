import {
  fetchAssistanceTypes,
  type FetchAssistanceTypesResponse,
} from "@/api/fetch-assistance-types";
import { useQuery } from "@tanstack/react-query";

export function useFetchAssistanceTypes(slug: string | undefined) {
  return useQuery<FetchAssistanceTypesResponse, Error>({
    queryKey: ["assistanceTypes", slug],
    queryFn: () => fetchAssistanceTypes({ slug: slug! }),
    enabled: !!slug,
  });
}
