import { api } from "@/lib/axios";

export interface CreateEnrollmentInput {
  courseId: string;
  enrolledAt?: string;
  notes?: string;
}

export async function createEnrollment({
  slug,
  personId,
  body,
}: {
  slug: string;
  personId: string;
  body: CreateEnrollmentInput;
}): Promise<void> {
  await api.post(
    `/organizations/${slug}/persons/${personId}/enrollments`,
    body,
  );
}
