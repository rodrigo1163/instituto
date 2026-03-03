import { api } from "@/lib/axios";

export async function removeRelative({
  slug,
  personId,
  relativeId,
}: {
  slug: string;
  personId: string;
  relativeId: string;
}): Promise<void> {
  await api.delete(
    `/organizations/${slug}/persons/${personId}/relatives/${relativeId}`,
  );
}
