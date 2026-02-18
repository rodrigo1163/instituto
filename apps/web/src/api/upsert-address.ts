import { api } from "@/lib/axios";

export interface UpsertAddressInput {
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
}

export interface UpsertAddressResponse {
  id: string;
}

export async function upsertAddress({
  slug,
  personId,
  body,
}: {
  slug: string;
  personId: string;
  body: UpsertAddressInput;
}): Promise<UpsertAddressResponse> {
  const response = await api.post<UpsertAddressResponse>(
    `/organizations/${slug}/persons/${personId}/address`,
    body,
  );
  return response.data;
}
