import { api } from "@/lib/axios";

export const KINSHIP_DEGREES = [
  "SPOUSE",
  "CHILD",
  "FATHER",
  "MOTHER",
  "SIBLING",
  "GRANDPARENT",
  "GRANDCHILD",
  "UNCLE_AUNT",
  "NEPHEW_NIECE",
  "COUSIN",
  "OTHER",
] as const;

export type KinshipDegree = (typeof KINSHIP_DEGREES)[number];

export interface CreateRelativeInput {
  relativeName: string;
  degree: KinshipDegree;
  degreeText?: string;
  phoneNumber?: string;
}

export async function createRelative({
  slug,
  personId,
  body,
}: {
  slug: string;
  personId: string;
  body: CreateRelativeInput;
}): Promise<void> {
  await api.post(
    `/organizations/${slug}/persons/${personId}/relatives`,
    body,
  );
}
