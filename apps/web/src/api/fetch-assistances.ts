import { api } from "@/lib/axios";

export interface Assistance {
  id: string;
  personId: string;
  assistanceTypeId: string;
  receivedAt: string;
  quantity: number | null;
  valueCents: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  assistanceType?: {
    id: string;
    name: string;
  };
}

export interface FetchAssistancesParams {
  personId: string | undefined;
  slug: string;
}

export interface FetchAssistancesResponse {
  assistances: Assistance[];
}

export async function fetchAssistances({
  personId,
  slug,
}: FetchAssistancesParams): Promise<FetchAssistancesResponse | null> {
  if (!personId) {
    return null;
  }

  const response = await api.get<FetchAssistancesResponse>(
    `/organizations/${slug}/persons/${personId}/assistances`,
  );

  return response.data;
}
