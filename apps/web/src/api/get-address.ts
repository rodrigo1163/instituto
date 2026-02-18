import { api } from "@/lib/axios";

export interface GetAddressParams {
  personId: string | undefined;
  slug: string;
}

export interface GetAddressResponse {
  address: {
    id: string;
    cep: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string | null;
    personId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export async function getAddress({
  personId,
  slug,
}: GetAddressParams): Promise<GetAddressResponse | null> {
  if (!personId) {
    return null;
  }

  const response = await api.get<GetAddressResponse>(
    `/organizations/${slug}/persons/${personId}/address`,
  );
  return response.data;
}
