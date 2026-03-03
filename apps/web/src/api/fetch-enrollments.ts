import { api } from "@/lib/axios";

export interface Enrollment {
  id: string;
  personId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    title: string;
  };
}

export interface FetchEnrollmentsParams {
  personId: string | undefined;
  slug: string;
}

export interface FetchEnrollmentsResponse {
  enrollments: Enrollment[];
}

export async function fetchEnrollments({
  personId,
  slug,
}: FetchEnrollmentsParams): Promise<FetchEnrollmentsResponse | null> {
  if (!personId) {
    return null;
  }

  const response = await api.get<FetchEnrollmentsResponse>(
    `/organizations/${slug}/persons/${personId}/enrollments`,
  );

  return response.data;
}
