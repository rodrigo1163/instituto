import { api } from "@/lib/axios";

export type AssistanceType = {
  id: string;
  name: string;
  description: string | null;
};

export type FetchAssistanceTypesResponse = {
  assistanceTypes: AssistanceType[];
};

export async function fetchAssistanceTypes({
  slug,
}: {
  slug: string;
}): Promise<FetchAssistanceTypesResponse> {
  const response = await api.get<FetchAssistanceTypesResponse>(
    `/organizations/${slug}/assistance-types`
  );
  return response.data;
}
