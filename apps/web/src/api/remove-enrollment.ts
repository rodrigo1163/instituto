import { api } from "@/lib/axios";

export async function removeEnrollment({
  slug,
  personId,
  enrollmentId,
}: {
  slug: string;
  personId: string;
  enrollmentId: string;
}): Promise<void> {
  await api.delete(
    `/organizations/${slug}/persons/${personId}/enrollments/${enrollmentId}`,
  );
}
