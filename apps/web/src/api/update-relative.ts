import { api } from "@/lib/axios";
import type { KinshipDegree } from "./create-relative";

export interface UpdateRelativeInput {
  relativeName?: string;
  degree?: KinshipDegree;
  degreeText?: string | null;
  phoneNumber?: string | null;
}

export async function updateRelative({
  slug,
  personId,
  relativeId,
  body,
}: {
  slug: string;
  personId: string;
  relativeId: string;
  body: UpdateRelativeInput;
}): Promise<void> {
  await api.put(
    `/organizations/${slug}/persons/${personId}/relatives/${relativeId}`,
    body,
  );
}
