import { api } from "@/lib/axios";

export interface CreateAssistanceInput {
  assistanceTypeId: string;
  receivedAt?: string;
  quantity?: number;
  valueCents?: number;
  notes?: string;
}

export async function createAssistance({
  slug,
  personId,
  body,
}: {
  slug: string;
  personId: string;
  body: CreateAssistanceInput;
}): Promise<void> {
  await api.post(
    `/organizations/${slug}/persons/${personId}/assistances`,
    body,
  );
}
