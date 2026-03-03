import { api } from "@/lib/axios";

export interface UpdateEnrollmentInput {
  completedAt?: string | null;
  notes?: string | null;
}

export async function updateEnrollment({
  slug,
  personId,
  enrollmentId,
  body,
}: {
  slug: string;
  personId: string;
  enrollmentId: string;
  body: UpdateEnrollmentInput;
}): Promise<void> {
  await api.put(
    `/organizations/${slug}/persons/${personId}/enrollments/${enrollmentId}`,
    body,
  );
}
