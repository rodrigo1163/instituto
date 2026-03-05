import { api } from "@/lib/axios";

export interface UpdateAssistanceInput {
  receivedAt?: string;
  quantity?: number | null;
  valueCents?: number | null;
  notes?: string | null;
}

export async function updateAssistance({
  slug,
  personId,
  assistanceId,
  body,
}: {
  slug: string;
  personId: string;
  assistanceId: string;
  body: UpdateAssistanceInput;
}): Promise<void> {
  await api.put(
    `/organizations/${slug}/persons/${personId}/assistances/${assistanceId}`,
    body,
  );
}
