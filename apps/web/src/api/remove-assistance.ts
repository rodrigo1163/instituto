import { api } from "@/lib/axios";

export async function removeAssistance({
  slug,
  personId,
  assistanceId,
}: {
  slug: string;
  personId: string;
  assistanceId: string;
}): Promise<void> {
  await api.delete(
    `/organizations/${slug}/persons/${personId}/assistances/${assistanceId}`,
  );
}
