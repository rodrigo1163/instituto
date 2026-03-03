import { api } from "@/lib/axios";
import type { KinshipDegree } from "./create-relative";

export interface GetRelativesParams {
  personId: string | undefined;
  slug: string;
}

export interface Relative {
  id: string;
  personId: string;
  relativeName: string;
  degree: KinshipDegree;
  degreeText: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetRelativesResponse {
  relatives: Relative[];
}

export async function getRelatives({
  personId,
  slug,
}: GetRelativesParams): Promise<GetRelativesResponse | null> {
  if (!personId) {
    return null;
  }

  const response = await api.get<GetRelativesResponse | null>(
    `/organizations/${slug}/persons/${personId}/relatives`,
  );

  return response.data;
}

